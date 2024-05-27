export type Props<C extends React.ElementType> = React.ComponentPropsWithoutRef<C>
export type PropsExcept<C extends React.ElementType, T extends keyof any> = Omit<Props<C>, T>

// Tips:
// https://react-typescript-cheatsheet.netlify.app/docs/advanced/types_react_api