import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { getHoverInformation } from './graphql-language-service/interface';
import getCurrentSchema from './getCurrentSchema';

// Like https://github.com/graphql/codemirror-graphql/blob/master/src/info.js

class HoverProvider implements monaco.languages.HoverProvider {
  provideHover(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    token: monaco.CancellationToken,
  ): monaco.languages.ProviderResult<monaco.languages.Hover> {
    const schema = getCurrentSchema();
    const queryText = model.getValue();
    return getHoverInformation(schema, queryText, position);
  }
}

monaco.languages.registerHoverProvider('graphiql', new HoverProvider());
