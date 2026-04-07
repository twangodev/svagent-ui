<script lang="ts">
	import { Response } from "$lib/registry/ui/response/index.js";

	const markdown = `### Welcome

This is a **rich markdown** showcase with multiple features.

---

## Data Table

| Name  | Role     | Status |
|-------|----------|--------|
| Alice | Engineer | Active |
| Bob   | Designer | Active |
| Carol | PM       | Active |

## Inspiration

> *Simplicity is the ultimate sophistication.*
> — Leonardo da Vinci

## Inline and Block Code

Use \`let total = items.length\` to count elements.

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
print(greet("World"))
\`\`\`
`;

	let content = $state("");

	$effect(() => {
		let index = 0;
		const step = 3;
		const interval = setInterval(() => {
			if (index < markdown.length) {
				index = Math.min(index + step, markdown.length);
				content = markdown.slice(0, index);
			} else {
				clearInterval(interval);
			}
		}, 30);
		return () => clearInterval(interval);
	});
</script>

<div class="h-full min-h-0 w-full overflow-hidden">
	<Response {content} class="h-full overflow-auto p-10" />
</div>