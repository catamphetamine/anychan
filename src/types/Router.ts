import type { PageLoadFunction as PageLoadFunction_ } from 'react-pages'
import type { PageMetaFunction as PageMetaFunction_ } from 'react-pages';
import type { Location as Location_ } from 'react-pages'

import type { State, LoadContext, PageStateReducerName } from './index.js'

export type Location = Location_

export type PageMetaFunction<Props = Record<string, any>> = PageMetaFunction_<Props, State, PageStateReducerName>

export type PageLoadFunction<Props = Record<string, any>, NavigationContext = any> = PageLoadFunction_<Props, State, LoadContext, NavigationContext>