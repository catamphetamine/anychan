import React from "react"

// Fixes `React.forwardRef()` not supporting generics.
// https://fettblog.eu/typescript-react-generic-forward-refs/
// https://stackoverflow.com/a/58473012/970769
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: ForwardedRef<T>) => ReactElement | null
  ): (props: P & RefAttributes<T>) => ReactElement | null
}