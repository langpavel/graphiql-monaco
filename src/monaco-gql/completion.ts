import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// import { getAutocompleteSuggestions } from 'graphql-language-service-interface';

// Like https://github.com/graphql/codemirror-graphql/blob/master/src/hint.js

class CompletionItemProvider
  implements monaco.languages.CompletionItemProvider {
  provideCompletionItems(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    context: monaco.languages.CompletionContext,
    token: monaco.CancellationToken,
  ): monaco.languages.ProviderResult<monaco.languages.CompletionList> {
    // const schema = options.schema;
    // if (!schema) {
    //   return;
    // }

    // const cur = editor.getCursor();
    // const token = editor.getTokenAt(cur);
    // const rawResults = getAutocompleteSuggestions(
    //   schema,
    //   editor.getValue(),
    //   cur,
    //   token,
    // );
    // /**
    //  * GraphQL language service responds to the autocompletion request with
    //  * a different format:
    //  * type CompletionItem = {
    //  *   label: string,
    //  *   kind?: number,
    //  *   detail?: string,
    //  *   documentation?: string,
    //  *   // GraphQL Deprecation information
    //  *   isDeprecated?: ?string,
    //  *   deprecationReason?: ?string,
    //  * };
    //  *
    //  * Switch to codemirror-compliant format before returning results.
    //  */
    // const tokenStart =
    //   token.type !== null && /"|\w/.test(token.string[0])
    //     ? token.start
    //     : token.end;
    // const results = {
    //   list: rawResults.map(item => ({
    //     text: item.label,
    //     type: schema.getType(item.detail),
    //     description: item.documentation,
    //     isDeprecated: item.isDeprecated,
    //     deprecationReason: item.deprecationReason,
    //   })),
    //   from: {line: cur.line, column: tokenStart},
    //   to: {line: cur.line, column: token.end},
    // };

    // if (results && results.list && results.list.length > 0) {
    //   results.from = CodeMirror.Pos(results.from.line, results.from.column);
    //   results.to = CodeMirror.Pos(results.to.line, results.to.column);
    //   CodeMirror.signal(editor, 'hasCompletion', editor, results, token);
    // }

    // return results;

    return {
      suggestions: [
        {
          label: model.id,
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: model.id,
          detail: 'model.id',
          documentation: 'model.id',
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
        },
        {
          label: model.uri.toString(),
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: JSON.stringify(model.uri.toJSON(), null, 2),
          detail: 'model.uri',
          documentation: 'model.uri',
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
        },
      ],
    };
  }
}

monaco.languages.registerCompletionItemProvider(
  'graphiql',
  new CompletionItemProvider(),
);
