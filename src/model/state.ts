import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { GraphiqlAction } from './action';

export type GraphiqlState = {
  readonly title: string;
  readonly currentEdiorIndex: number;
  readonly editors: ReadonlyArray<EditorState>;
  /** Mutable! */
  dispatch: React.Dispatch<GraphiqlAction>;
};

export type EditorState = {
  readonly textModel: monaco.editor.ITextModel;
  readonly options: monaco.editor.IEditorOptions;
};

const defaultQuery = `fragment FullType on __Type {
  kind name description
  fields(includeDeprecated: true) {
    name description
    args { ...InputValue }
    type { ...TypeRef }
    isDeprecated deprecationReason
  }
  inputFields { ...InputValue }
  interfaces { ...TypeRef }
  enumValues(includeDeprecated: true) {
    name description
    isDeprecated deprecationReason
  }
  possibleTypes { ...TypeRef }
}
fragment InputValue on __InputValue {
  name description
  type { ...TypeRef }
  defaultValue
}
fragment TypeRef on __Type {
  kind name ofType {
    kind name ofType {
      kind name ofType {
        kind name ofType {
          kind name ofType {
            kind name ofType {
              kind name ofType {
                kind name
              }
            }
          }
        }
      }
    }
  }
}
query introspection {
  __schema {
    types {
      ...FullType
    }
  }
}
`;

function dummyDispatch() {
  console.error(
    'dummyDispatch called. This is probably an implementation error',
  );
}

export function createEditorState(
  value: string = '',
  language: string,
  uri?: monaco.Uri,
): EditorState {
  return {
    textModel: monaco.editor.createModel(value, language, uri),
    options: { selectOnLineNumbers: true },
  };
}

export function createInitialState(): GraphiqlState {
  return {
    title: 'GraphiQL',
    currentEdiorIndex: 0,
    editors: [createEditorState(defaultQuery, 'graphiql')],
    dispatch: dummyDispatch,
  };
}

export const initialState: GraphiqlState = createInitialState();
