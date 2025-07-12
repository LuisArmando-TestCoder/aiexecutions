import type { SvelteComponent } from "svelte";

export type TextType =
  | "paragraph"
  | "sub-italic"
  | "sub-highlight-italic"
  | "highlight"
  | "title"
  | "title-highlight"
  | "title-sub-italic"
  | "title-sub-highlight-italic"
  | "subtitle"
  | "subtitle-highlight"
  | "subtitle-sub-italic"
  | "subtitle-sub-highlight-italic";

export type TextNode = {
  text: string;
  type: TextType;
};

export type Block = {
  header: boolean;
  type?: TextType;
  text?: string;
  segments?: TextNode[];
};

export type Store = { [index: string]: any };

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export type Language = {
  code: string;
  name: string;
};

export interface Card {
  id: string;
  title: string;
  description?: string;
  selected: boolean;
}

export type ComponentSteps = [(store: Store) => boolean, SvelteComponent][];

export interface Article {
  title: string;
  content: string;
  link: string;
  community: string;
  lead: string;
}

export interface EmailAuth {
  user: string;
  pass: string;
}

export type Populator<T extends object> = (
  propertyPath: string,
  value: any
) => T;
