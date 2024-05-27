import type { ReactElement } from "react";

export type Messages = any;

// I dunno how to define the structure of messages. It seems to be showign errors.
//
// interface MessagesEntry {
// 	[any: string]: string | MessagesEntry
// }
//
// export type Messages = Record<string, MessagesEntry>export type MessageType = string | (string | JSX.Element)[]

export type MessageTypeString = string
export type MessageTypeElements = (string | ReactElement)[]

export type MessageType = MessageTypeString | MessageTypeElements
