import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/platform/commands/common/commands';

monaco.editor.setTheme('vs-dark');

// https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.ilanguageextensionpoint.html
monaco.languages.register({ id: 'graphiql' });

// https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.languageconfiguration.html
const conf: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: '#',
  },
  brackets: [['{', '}'], ['[', ']'], ['(', ')']],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"""', close: '"""', notIn: ['string', 'comment'] },
    { open: '"', close: '"', notIn: ['string', 'comment'] },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"""', close: '"""' },
    { open: '"', close: '"' },
  ],
  folding: {
    offSide: true,
  },
};

monaco.languages.setLanguageConfiguration('graphiql', conf);
