// The following import seems to somehow break this file for some reason.
// import type { FC, SVGProps } from 'react'

// The following import seems to somehow break this file for some reason.
// import type { Dispatch } from 'redux'
type Dispatch = (action: object) => void

// The following import seems to somehow break this file for some reason.
// import type { Location as Location_ } from 'react-pages'
interface Location_ {
  pathname: string;
  search?: string;
  hash?: string;
  query: Record<string, string>;
}

declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.css' {
  const url: string;
  export default url;
}

interface Window {
  _onNavigate: (parameters: { dispatch: Dispatch }) => void;
  _onBeforeNavigate: (parameters: { dispatch: Dispatch }) => void;
  _previouslyVisitedPage?: {
    location: Location_,
    params: Record<string, string>
  };
  _isNavigationInProgress?: boolean;
  SHOW_POST_HEADER?: boolean;
  SHOW_POST_THUMBNAIL?: boolean;
  POST_FULL_WIDTH?: boolean;
  SHOW_COOKIE_NOTICE?: boolean;
  LABELS?: object;
  VERSION: string;
  anychan_activateProgressiveWebApp(parameters: { manifestUrl: string }): void;
  // To debug the design of the search input,
  // set `window.rruiCollapseOnFocusOut = false` flag in the browser console.
  rruiCollapseOnFocusOut?: boolean;
  // `virtual-scroller` debug flag.
  VirtualScrollerDebug?: boolean;
}

declare namespace process {
  const env: {
    // https://webpack.js.org/configuration/mode/
    NODE_ENV: 'production' | 'development'
  }
}
