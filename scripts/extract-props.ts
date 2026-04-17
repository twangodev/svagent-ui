/**
 * Extracts component prop metadata from Svelte registry sources.
 *
 * For each component listed in `content/components/*.md` (excluding index.md),
 * this script reads `src/lib/registry/ui/<name>/<name>.svelte`, parses its
 * TypeScript blocks, and emits a structured JSON file consumed at doc-build
 * time to generate `<ComponentAPI component="<name>" />` props tables.
 *
 * MODE: lenient. Missing JSDoc descriptions and missing defaults produce empty
 * cells — the script does not fail. Once every component has JSDoc on its
 * Props type, flip `STRICT_MODE` below to `true` to enforce documentation on
 * all new props going forward.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
	Project,
	SyntaxKind,
	type PropertySignature,
	type TypeNode,
	type JSDoc,
	Node,
} from "ts-morph";

const STRICT_MODE = false;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content", "components");
const REGISTRY_DIR = join(ROOT, "src", "lib", "registry", "ui");
const OUTPUT = join(ROOT, "src", "lib", "__generated__", "props.json");

type Prop = {
	name: string;
	type: string;
	optional: boolean;
	description: string;
	default: string;
};

type ExtractResult = {
	props: Prop[];
};

type PropsIndex = Record<string, ExtractResult>;

function toPascalCase(name: string): string {
	return name.replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase());
}

function listComponentNames(): string[] {
	return readdirSync(CONTENT_DIR)
		.filter((f) => f.endsWith(".md") && f !== "index.md")
		.map((f) => f.replace(/\.md$/, ""))
		.sort();
}

/** Strip Svelte scaffolding and return the TypeScript contents of the module
 *  and instance <script> blocks, if any. */
function splitScripts(source: string): { module: string | null; instance: string | null } {
	const moduleMatch = source.match(/<script\b[^>]*\bmodule\b[^>]*>([\s\S]*?)<\/script>/);
	const instanceMatch = source.match(
		/<script(?![^>]*\bmodule\b)[^>]*>([\s\S]*?)<\/script>/,
	);
	return {
		module: moduleMatch ? moduleMatch[1] : null,
		instance: instanceMatch ? instanceMatch[1] : null,
	};
}

/** Walk a type node, returning the union of members across any TypeLiteral
 *  child nodes (direct, or inside intersection types). Named type references
 *  like `HTMLAttributes<HTMLDivElement>` are intentionally ignored — we only
 *  document the svagent-specific inline members. */
function collectLiteralMembers(typeNode: TypeNode | undefined): PropertySignature[] {
	if (!typeNode) return [];

	if (typeNode.isKind(SyntaxKind.TypeLiteral)) {
		return typeNode
			.getMembers()
			.filter((m): m is PropertySignature => m.isKind(SyntaxKind.PropertySignature));
	}

	if (typeNode.isKind(SyntaxKind.IntersectionType)) {
		return typeNode.getTypeNodes().flatMap(collectLiteralMembers);
	}

	return [];
}

/** Pull `@default` tag value from a JSDoc block, if present. */
function extractDefaultFromJsDoc(docs: JSDoc[]): string {
	for (const doc of docs) {
		for (const tag of doc.getTags()) {
			if (tag.getTagName() === "default") {
				return (tag.getCommentText() ?? "").trim();
			}
		}
	}
	return "";
}

/** Pull the main description text (no tags) from a JSDoc block, if present. */
function extractDescriptionFromJsDoc(docs: JSDoc[]): string {
	for (const doc of docs) {
		const desc = doc.getDescription().trim();
		if (desc) return desc;
	}
	return "";
}

/** Parse instance script's `let { ... } = $props()` and return a map of
 *  binding name → default initializer source text. */
function parseDestructuringDefaults(instanceSource: string): Record<string, string> {
	const project = new Project({ useInMemoryFileSystem: true, compilerOptions: { allowJs: false } });
	const file = project.createSourceFile("__instance.ts", instanceSource, { overwrite: true });
	const defaults: Record<string, string> = {};

	file.forEachDescendant((node) => {
		if (!node.isKind(SyntaxKind.CallExpression)) return;
		const call = node.asKindOrThrow(SyntaxKind.CallExpression);
		const expr = call.getExpression();
		if (expr.getText() !== "$props") return;

		// $props() is on the RHS of a VariableDeclaration whose name is an
		// ObjectBindingPattern. Walk up to find it.
		let parent: Node | undefined = call.getParent();
		while (parent && !parent.isKind(SyntaxKind.VariableDeclaration)) {
			parent = parent.getParent();
		}
		if (!parent) return;
		const varDecl = parent.asKindOrThrow(SyntaxKind.VariableDeclaration);
		const name = varDecl.getNameNode();
		if (!name.isKind(SyntaxKind.ObjectBindingPattern)) return;

		for (const element of name.getElements()) {
			const binding = element.getNameNode();
			if (!binding.isKind(SyntaxKind.Identifier)) continue;
			const propName =
				element.getPropertyNameNode()?.getText() ?? binding.getText();
			const initializer = element.getInitializer();
			if (initializer) {
				defaults[propName] = initializer.getText();
			}
		}
	});

	return defaults;
}

/** Resolve the Props-type TypeNode for a component. Prefers an exported
 *  `<Pascal>Props` alias in the module block, falls back to the inline type
 *  annotation on the instance block's `$props()` destructuring. */
function resolvePropsTypeNode(
	moduleSource: string | null,
	instanceSource: string | null,
	componentName: string,
): TypeNode | undefined {
	const project = new Project({ useInMemoryFileSystem: true, compilerOptions: { allowJs: false } });

	if (moduleSource) {
		const file = project.createSourceFile("__module.ts", moduleSource, { overwrite: true });
		const expected = `${toPascalCase(componentName)}Props`;

		// Exact match first
		for (const alias of file.getTypeAliases()) {
			if (alias.getName() === expected) {
				return alias.getTypeNode();
			}
		}
		// Any `*Props` alias as a fallback (e.g. compound components)
		for (const alias of file.getTypeAliases()) {
			if (alias.getName().endsWith("Props")) {
				return alias.getTypeNode();
			}
		}
	}

	if (instanceSource) {
		const file = project.createSourceFile("__instance.ts", instanceSource, { overwrite: true });
		let found: TypeNode | undefined;
		file.forEachDescendant((node) => {
			if (found) return;
			if (!node.isKind(SyntaxKind.CallExpression)) return;
			const call = node.asKindOrThrow(SyntaxKind.CallExpression);
			if (call.getExpression().getText() !== "$props") return;
			let parent: Node | undefined = call.getParent();
			while (parent && !parent.isKind(SyntaxKind.VariableDeclaration)) {
				parent = parent.getParent();
			}
			if (!parent) return;
			const varDecl = parent.asKindOrThrow(SyntaxKind.VariableDeclaration);
			found = varDecl.getTypeNode();
		});
		return found;
	}

	return undefined;
}

function extractForComponent(componentName: string): ExtractResult | null {
	const svelteFile = join(REGISTRY_DIR, componentName, `${componentName}.svelte`);
	if (!existsSync(svelteFile)) {
		console.warn(`[extract-props] no svelte file for '${componentName}' at ${svelteFile}`);
		return null;
	}

	const source = readFileSync(svelteFile, "utf-8");
	const { module: moduleSource, instance: instanceSource } = splitScripts(source);

	const typeNode = resolvePropsTypeNode(moduleSource, instanceSource, componentName);
	if (!typeNode) {
		console.warn(`[extract-props] no props type resolved for '${componentName}'`);
		return { props: [] };
	}

	const members = collectLiteralMembers(typeNode);
	const destructuringDefaults = instanceSource ? parseDestructuringDefaults(instanceSource) : {};
	const props: Prop[] = [];
	const undocumented: string[] = [];

	for (const m of members) {
		const name = m.getName();
		const type = m.getTypeNode()?.getText() ?? "unknown";
		const optional = m.hasQuestionToken();
		const docs = m.getJsDocs();
		const description = extractDescriptionFromJsDoc(docs);
		const jsDocDefault = extractDefaultFromJsDoc(docs);
		const destructDefault = destructuringDefaults[name] ?? "";
		const def = jsDocDefault || destructDefault;

		if (!description) undocumented.push(name);

		props.push({ name, type, optional, description, default: def });
	}

	if (STRICT_MODE && undocumented.length > 0) {
		throw new Error(
			`[extract-props] ${componentName}: missing JSDoc on props: ${undocumented.join(", ")}`,
		);
	}
	if (undocumented.length > 0) {
		console.warn(
			`[extract-props] ${componentName}: ${undocumented.length} undocumented prop(s): ${undocumented.join(", ")}`,
		);
	}

	return { props };
}

function main() {
	const names = listComponentNames();
	const index: PropsIndex = {};

	for (const name of names) {
		const result = extractForComponent(name);
		if (result) index[name] = result;
	}

	writeFileSync(OUTPUT, JSON.stringify(index, null, "\t") + "\n");
	const totalProps = Object.values(index).reduce((sum, r) => sum + r.props.length, 0);
	console.log(
		`[extract-props] wrote ${OUTPUT} — ${Object.keys(index).length} components, ${totalProps} props`,
	);
}

main();