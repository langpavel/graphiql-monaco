import React, { useReducer, useMemo } from 'react';
import { initialState } from './model/state';
import Context from './model/Context';
import Editor from './Editor';
import './Graphiql.css';
import reducer from './model/reducer';
import ResultView from './ResultView';

export default function Graphiql() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const context = useMemo(() => {
    state.dispatch = dispatch;
    return state;
  }, [state, dispatch]);
  const editorState = state.editors[state.currentEdiorIndex];
  return (
    <Context.Provider value={context}>
      <div className="Graphiql">
        <header className="Graphiql-header">
          {state.title}
          <button onClick={() => dispatch({ type: 'init' })}>Reset</button>
        </header>
        <div className="Graphiql-main">
          <div className="Graphiql-editor">
            <Editor width="100%" height="100%" {...editorState} />
          </div>
          <div className="Graphiql-results">
            <ResultView />
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}
