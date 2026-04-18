export type ExampleFormValues = {
	firstName: string;
	lastName: string;
};

export type ExampleFormErrors = Partial<Record<keyof ExampleFormValues, string>>;

export function validateExampleForm(values: ExampleFormValues): ExampleFormErrors {
	const errors: ExampleFormErrors = {};
	if (values.firstName.length > 0 && values.firstName.length < 2) {
		errors.firstName = "First name must be at least 2 characters.";
	}
	if (values.lastName.length > 0 && values.lastName.length < 2) {
		errors.lastName = "Last name must be at least 2 characters.";
	}
	return errors;
}
