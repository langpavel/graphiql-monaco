/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import { Location } from 'graphql';
import * as monaco from 'monaco-editor';

export function offsetToPosition(text: string, loc: number): monaco.Position {
  const EOL = '\n';
  const buf = text.slice(0, loc);
  const lines = buf.split(EOL).length - 1;
  const lastLineIndex = buf.lastIndexOf(EOL);
  return new monaco.Position(lines, loc - lastLineIndex - 1);
}

export function locToRange(text: string, loc: Location): monaco.Range {
  const start = offsetToPosition(text, loc.start);
  const end = offsetToPosition(text, loc.end);
  return new monaco.Range(
    start.lineNumber,
    start.column,
    end.lineNumber,
    end.column,
  );
}
