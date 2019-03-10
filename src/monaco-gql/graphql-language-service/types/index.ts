/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import {
  GraphQLSchema,
  ASTNode,
  DocumentNode,
  FragmentDefinitionNode,
  NamedTypeNode,
  TypeDefinitionNode,
  ValidationContext,
  GraphQLArgument,
  GraphQLEnumValue,
  GraphQLField,
  GraphQLInputField,
  GraphQLType,
  GraphQLDirective,
} from 'graphql';

export { GraphQLConfig, GraphQLProjectConfig } from 'graphql-config';
import { GraphQLConfig, GraphQLProjectConfig } from 'graphql-config';

import * as monaco from 'monaco-editor';

export type HoverContents = null | string | monaco.languages.Hover['contents'];

export type TokenPattern = string | ((char: string) => boolean) | RegExp;

export interface CharacterStream {
  getStartOfToken: () => number;
  getCurrentPosition: () => number;
  eol: () => boolean;
  sol: () => boolean;
  peek: () => string | null;
  next: () => string;
  eat: (pattern: TokenPattern) => string | void;
  eatWhile: (match: TokenPattern) => boolean;
  eatSpace: () => boolean;
  skipToEnd: () => void;
  skipTo: (position: number) => void;
  match: (
    pattern: TokenPattern,
    consume?: boolean,
    caseFold?: boolean,
  ) => string[] | boolean;
  backUp: (num: number) => void;
  column: () => number;
  indentation: () => number;
  current: () => string;
}

// Cache and config-related.
export type GraphQLConfiguration = GraphQLProjectConfiguration & {
  projects?: {
    [projectName: string]: GraphQLProjectConfiguration;
  };
};

export type GraphQLProjectConfiguration = {
  // The name for this project configuration.
  // If not supplied, the object key can be used for the project name.
  name?: string;
  schemaPath?: string; // a file with schema IDL

  // For multiple applications with overlapping files,
  // these configuration options may be helpful
  includes?: string[];
  excludes?: string[];

  // If you'd like to specify any other configurations,
  // we provide a reserved namespace for it
  extensions?: GraphQLConfigurationExtension;
};

export type GraphQLConfigurationExtension = {
  [name: string]: unknown;
};

export interface GraphQLCache {
  getGraphQLConfig: () => GraphQLConfig;

  getObjectTypeDependencies: (
    query: string,
    fragmentDefinitions: null | Map<string, ObjectTypeInfo>,
  ) => Promise<ObjectTypeInfo[]>;

  getObjectTypeDependenciesForAST: (
    parsedQuery: ASTNode,
    fragmentDefinitions: Map<string, ObjectTypeInfo>,
  ) => Promise<ObjectTypeInfo[]>;

  getObjectTypeDefinitions: (
    graphQLConfig: GraphQLProjectConfig,
  ) => Promise<Map<string, ObjectTypeInfo>>;

  readonly updateObjectTypeDefinition: (
    rootDir: Uri,
    filePath: Uri,
    contents: CachedContent[],
  ) => Promise<void>;

  readonly updateObjectTypeDefinitionCache: (
    rootDir: Uri,
    filePath: Uri,
    exists: boolean,
  ) => Promise<void>;

  getFragmentDependencies: (
    query: string,
    fragmentDefinitions: null | Map<string, FragmentInfo>,
  ) => Promise<FragmentInfo[]>;

  getFragmentDependenciesForAST: (
    parsedQuery: ASTNode,
    fragmentDefinitions: Map<string, FragmentInfo>,
  ) => Promise<FragmentInfo[]>;

  getFragmentDefinitions: (
    graphQLConfig: GraphQLProjectConfig,
  ) => Promise<Map<string, FragmentInfo>>;

  readonly updateFragmentDefinition: (
    rootDir: Uri,
    filePath: Uri,
    contents: CachedContent[],
  ) => Promise<void>;

  readonly updateFragmentDefinitionCache: (
    rootDir: Uri,
    filePath: Uri,
    exists: boolean,
  ) => Promise<void>;

  getSchema: (
    appName?: string,
    queryHasExtensions?: boolean,
  ) => Promise<GraphQLSchema | null>;

  handleWatchmanSubscribeEvent: (
    rootDir: string,
    projectConfig: GraphQLProjectConfig,
  ) => (result: Object) => void;
}

// online-parser related
// export interface Position {
//   line: number;
//   character: number;
//   lessThanOrEqualTo: (position: Position) => boolean;
// }

export interface Range {
  start: Position;
  end: Position;
  containsPosition: (position: Position) => boolean;
}

export type CachedContent = {
  query: string;
  range: Range | null;
};

export type ParseRule =
  | ((token: Token, stream: CharacterStream) => string | null)
  | Array<Rule | string>;

export type Token = {
  kind: string;
  value: string;
};

export type Rule = {
  style?: string;
  match?: (token: Token) => boolean;
  update?: (state: State, token: Token) => void;
  separator?: string | Rule;
  isList?: boolean;
  ofRule?: Rule | string;
};

export class State implements monaco.languages.IState {
  level: number = 0;
  step: number = 0;
  levels?: number[];
  prevState: null | State = null;
  rule: null | ParseRule = null;
  kind: null | string = null;
  name: null | string = null;
  type: null | string = null;
  needsSeperator: boolean = false;
  needsAdvance: boolean = false;
  indentLevel: number = 0;

  clone(): State {
    const copy = new State();
    Object.assign(copy, this);
    return copy;
  }

  equals(other: monaco.languages.IState): boolean {
    return this === other;
  }
}

// GraphQL Language Service related types
export type Uri = string;

export type GraphQLFileMetadata = {
  filePath: Uri;
  size: number;
  mtime: number;
};

export type GraphQLFileInfo = {
  filePath: Uri;
  content: string;
  asts: DocumentNode[];
  size: number;
  mtime: number;
};

export type ContextToken = {
  start: number;
  end: number;
  string: string;
  state: State;
  style: string;
  isBeforeCursor: boolean;
};

export type TypeInfo = {
  type: null | GraphQLType;
  parentType: null | GraphQLType;
  inputType: null | GraphQLType;
  directiveDef: null | GraphQLDirective;
  fieldDef: null | GraphQLField<unknown, unknown>;
  enumValue: null | GraphQLEnumValue;
  argDef: null | GraphQLArgument;
  argDefs: null | GraphQLArgument[];
  objectFieldDefs: null | GraphQLInputField;
};

export type FragmentInfo = {
  filePath?: Uri;
  content: string;
  definition: FragmentDefinitionNode;
};

export type NamedTypeInfo = {
  filePath?: Uri;
  content: string;
  definition: NamedTypeNode;
};

export type ObjectTypeInfo = {
  filePath?: Uri;
  content: string;
  definition: TypeDefinitionNode;
};

export type CustomValidationRule = (context: ValidationContext) => Object;

export type Diagnostic = {
  range: Range;
  severity?: number;
  code?: number | string;
  source?: string;
  message: string;
};

export type CompletionItem = monaco.languages.CompletionItem;
// {
//   label: string;
//   kind?: number;
//   detail?: string;
//   documentation?: null | string;
//   // GraphQL Deprecation information
//   isDeprecated?: boolean;
//   deprecationReason?: string;
// };

// Below are basically a copy-paste from Nuclide rpc types for definitions.

// Definitions/hyperlink
export type Definition = {
  path: Uri;
  position: Position;
  range?: Range;
  id?: string;
  name?: string;
  language: string;
  projectRoot?: Uri;
};
export type DefinitionQueryResult = {
  queryRange: Range[];
  definitions: Definition[];
};

// Outline view
export type TokenKind =
  | 'keyword'
  | 'class-name'
  | 'constructor'
  | 'method'
  | 'param'
  | 'string'
  | 'whitespace'
  | 'plain'
  | 'type';
export type TextToken = {
  kind: TokenKind;
  value: string;
};
export type TokenizedText = TextToken[];
export type OutlineTree = {
  // Must be one or the other. If both are present, tokenizedText is preferred.
  plainText?: string;
  tokenizedText?: TokenizedText;
  representativeName?: string;

  startPosition: Position;
  endPosition?: Position;
  children: OutlineTree[];
};
export type Outline = {
  outlineTrees: OutlineTree[];
};

export interface DidChangeWatchedFilesParams {
  changes: FileEvent[];
}
export interface FileEvent {
  uri: string;
  type: FileChangeType;
}
export const FileChangeTypeKind = {
  Created: 1,
  Changed: 2,
  Deleted: 3,
};
export type FileChangeType = 1 | 2 | 3;
