export type ToolbarItem = {
	title: string,
	onClick: () => void,
	isSelected?: boolean,
	icon: React.ElementType,
	iconSelected?: React.ElementType,
	iconActive?: React.ElementType,
	iconSelectedActive?: React.ElementType,
	animate?: 'pop',
	size?: 's',
	wait?: boolean,
	className?: string
} | {
	type: 'separator'
}