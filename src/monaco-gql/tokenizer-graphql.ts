import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {
  LexRules,
  ParseRules,
  isIgnored,
  CharacterStream,
} from './graphql-language-service/parser';
import onlineParser, {
  OnlineParser,
} from './graphql-language-service/parser/onlineParser';
import { State } from './graphql-language-service/types';

// function indent(state, textAfter) {
//   const levels = state.levels;
//   // If there is no stack of levels, use the current level.
//   // Otherwise, use the top level, pre-emptively dedenting for close braces.
//   const level =
//     !levels || levels.length === 0
//       ? state.indentLevel
//       : levels[levels.length - 1] -
//         (this.electricInput.test(textAfter) ? 1 : 0);
//   return level * this.config.indentUnit;
// }

const suffix = '.graphql';

// see https://github.com/Microsoft/vscode/blob/master/src/vs/editor/standalone/common/themes.ts
const tokenToScopes: { [name: string]: string } = {
  ws: '',
  invalidchar: 'invalid.invalidchar' + suffix,
};

class TokensProvider {
  parser: OnlineParser;

  constructor() {
    this.parser = onlineParser({
      eatWhitespace: (stream) => stream.eatWhile(isIgnored),
      lexRules: LexRules,
      parseRules: ParseRules,
      editorConfig: { tabSize: 2 },
    });
  }

  /**
   * The initial state of a language. Will be the state passed in to tokenize the first line.
   */
  getInitialState(): State {
    return this.parser.startState();
  }
  /**
   * Tokenize a line given the state at the beginning of the line.
   */
  tokenize(line: string, state: State): monaco.languages.ILineTokens {
    const tokens: monaco.languages.IToken[] = [];
    const stream = new CharacterStream(line);
    while (!stream.eol()) {
      const token = this.parser.token(stream, state);
      const startIndex = stream.getStartOfToken();
      const scopes = tokenToScopes.hasOwnProperty(token)
        ? tokenToScopes[token]
        : `${token}${suffix}`;
      tokens.push({
        startIndex,
        scopes,
      });
    }
    // console.log(line, tokens.map((x) => x.scopes));
    return {
      tokens,
      endState: state,
    };
  }
}

monaco.languages.setTokensProvider('graphiql', new TokensProvider());
