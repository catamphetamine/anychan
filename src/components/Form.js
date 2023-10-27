export { default as Form } from './Form/Form.js'
export { default as Field } from './Form/Field.js'
export { Submit } from 'frontend-lib/components/Form.js'
export { default as FormComponentAndButton } from 'frontend-lib/components/FormComponentAndButton.js'
export { default as FormComponentsAndButton } from 'frontend-lib/components/FormComponentsAndButton.js'
export { default as FormAction } from 'frontend-lib/components/FormAction.js'
export { default as FormActions } from 'frontend-lib/components/FormActions.js'
export { default as FormComponent } from 'frontend-lib/components/FormComponent.js'
export { default as FormLabel } from 'frontend-lib/components/FormLabel.js'

export function FormStyle({ children }) {
	return <div>{children}</div>
}