import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import getCurrentSchema from './getCurrentSchema';
import { getAutocompleteSuggestions } from './graphql-language-service/interface';

// Like https://github.com/graphql/codemirror-graphql/blob/master/src/hint.js

class CompletionItemProvider
  implements monaco.languages.CompletionItemProvider {
  provideCompletionItems(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    context: monaco.languages.CompletionContext,
    token: monaco.CancellationToken,
  ): monaco.languages.ProviderResult<monaco.languages.CompletionList> {
    const schema = getCurrentSchema();
    if (!schema) {
      return;
    }
    const queryText = model.getValue();
    const suggestions = getAutocompleteSuggestions(
      schema,
      queryText,
      position,
      context,
    );
    // console.log('SUGGESTIONS', suggestions);

    if (!suggestions) return null;

    return {
      suggestions,
    };
  }
}

monaco.languages.registerCompletionItemProvider(
  'graphiql',
  new CompletionItemProvider(),
);
