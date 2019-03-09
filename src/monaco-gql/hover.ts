import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// Like https://github.com/graphql/codemirror-graphql/blob/master/src/info.js

class HoverProvider implements monaco.languages.HoverProvider {
  provideHover(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    token: monaco.CancellationToken,
  ): monaco.languages.ProviderResult<monaco.languages.Hover> {
    return {
      contents: [
        { value: '### Hover Content' },
        { value: `\`${position.toString()}\`` },
      ],
    };
  }
}

monaco.languages.registerHoverProvider('graphiql', new HoverProvider());
