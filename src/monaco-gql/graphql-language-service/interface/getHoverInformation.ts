/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/**
 * Ported from codemirror-graphql
 * https://github.com/graphql/codemirror-graphql/blob/master/src/info.js
 */

import { GraphQLSchema, GraphQLType } from 'graphql';
import * as monaco from 'monaco-editor';
import { ContextToken, TypeInfo } from '../types';
import { getTokenAtPosition, getTypeInfo } from './getAutocompleteSuggestions';
import { GraphQLNonNull, GraphQLList } from 'graphql';

type HoverOptions = {
  schema: GraphQLSchema;
};

export function getHoverInformation(
  schema: GraphQLSchema,
  queryText: string,
  cursor: monaco.Position,
  contextToken?: ContextToken,
): monaco.languages.Hover | null {
  const token = contextToken || getTokenAtPosition(queryText, cursor);

  // console.log('schema, token, token.state', schema, token, token.state);

  if (!schema || !token || !token.state) {
    return null;
  }

  const state = token.state;
  const kind = state.kind;
  const step = state.step;
  const typeInfo: TypeInfo = getTypeInfo(schema, token.state);
  const options: HoverOptions = { schema };

  // Given a Schema and a Token, produce the contents of an info tooltip.
  // To do this, create a div element that we will render "into" and then pass
  // it to various rendering functions.
  const into: string[] = [];
  if (
    (kind === 'Field' && step === 0 && typeInfo.fieldDef) ||
    (kind === 'AliasedField' && step === 2 && typeInfo.fieldDef)
  ) {
    renderField(into, typeInfo, options);
    renderDescription(into, options, typeInfo.fieldDef);
  } else if (kind === 'Directive' && step === 1 && typeInfo.directiveDef) {
    const into: string[] = [];
    renderDirective(into, typeInfo, options);
    renderDescription(into, options, typeInfo.directiveDef);
  } else if (kind === 'Argument' && step === 0 && typeInfo.argDef) {
    const into: string[] = [];
    renderArg(into, typeInfo, options);
    renderDescription(into, options, typeInfo.argDef);
  } else if (
    kind === 'EnumValue' &&
    typeInfo.enumValue &&
    typeInfo.enumValue.description
  ) {
    const into: string[] = [];
    renderEnumValue(into, typeInfo, options);
    renderDescription(into, options, typeInfo.enumValue);
  } else if (
    kind === 'NamedType' &&
    typeInfo.type &&
    (typeInfo.type as any).description
  ) {
    const into: string[] = [];
    renderType(into, typeInfo, options, typeInfo.type);
    renderDescription(into, options, typeInfo.type);
  } else {
    return null;
  }

  if (into.length) into.unshift('### ');

  return {
    contents: [{ value: into.join('').trim() }],
  };
}

function renderField(
  into: string[],
  typeInfo: TypeInfo,
  options: HoverOptions,
) {
  renderQualifiedField(into, typeInfo, options);
  renderTypeAnnotation(into, typeInfo, options, typeInfo.type);
}

function renderQualifiedField(
  into: string[],
  typeInfo: TypeInfo,
  options: HoverOptions,
) {
  if (!typeInfo.fieldDef) {
    return;
  }
  const fieldName = typeInfo.fieldDef.name;
  if (fieldName.slice(0, 2) !== '__') {
    renderType(into, typeInfo, options, typeInfo.parentType);
    text(into, '.');
  }
  escape(into, fieldName);
}

function renderDirective(
  into: string[],
  typeInfo: TypeInfo,
  options: HoverOptions,
) {
  if (!typeInfo.directiveDef) {
    return;
  }
  const name = '@' + typeInfo.directiveDef.name;
  escape(into, name);
}

function renderArg(into: string[], typeInfo: TypeInfo, options: HoverOptions) {
  if (typeInfo.directiveDef) {
    renderDirective(into, typeInfo, options);
  } else if (typeInfo.fieldDef) {
    renderQualifiedField(into, typeInfo, options);
  }

  if (!typeInfo.argDef) {
    return;
  }

  const name = typeInfo.argDef.name;
  text(into, '(');
  text(into, name);
  renderTypeAnnotation(into, typeInfo, options, typeInfo.inputType);
  text(into, ')');
}

function renderTypeAnnotation(
  into: string[],
  typeInfo: TypeInfo,
  options: HoverOptions,
  t: null | GraphQLType,
) {
  if (!t) return;
  text(into, ': ');
  renderType(into, typeInfo, options, t);
}

function renderEnumValue(
  into: string[],
  typeInfo: TypeInfo,
  options: HoverOptions,
) {
  if (!typeInfo.enumValue) {
    return;
  }
  const name = typeInfo.enumValue.name;
  renderType(into, typeInfo, options, typeInfo.inputType);
  text(into, '.');
  escape(into, name);
}

function renderType(
  into: string[],
  typeInfo: TypeInfo,
  options: HoverOptions,
  t: null | GraphQLType,
) {
  if (!t) return;
  if (t instanceof GraphQLNonNull) {
    renderType(into, typeInfo, options, t.ofType);
    text(into, '!');
  } else if (t instanceof GraphQLList) {
    text(into, '[');
    renderType(into, typeInfo, options, t.ofType);
    text(into, ']');
  } else {
    escape(into, t.name);
  }
}

function renderDescription(into: string[], options: HoverOptions, def: any) {
  if (!def) return;
  const description =
    typeof def.description === 'string' ? def.description : null;
  if (description) {
    text(into, '\n\n');
    text(into, description);
  }
  renderDeprecation(into, options, def);
}

function renderDeprecation(into: string[], options: HoverOptions, def: any) {
  if (!def) return;
  const reason =
    typeof def.deprecationReason === 'string' ? def.deprecationReason : null;
  if (!reason) return;
  text(into, '\n\n');
  text(into, '*Deprecated:* ');
  text(into, reason);
}

function escape(into: string[], content: string) {
  into.push(content.replace(/([_\*])/g, '\\$1'));
}

function text(into: string[], content: string) {
  into.push(content);
}
