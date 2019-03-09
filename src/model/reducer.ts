import { GraphiqlState, createInitialState } from './state';
import { GraphiqlAction } from './action';

export default function reducer(
  state: GraphiqlState,
  action: GraphiqlAction,
): GraphiqlState {
  console.debug(`Dispatching '${action.type}'`, action, state);
  switch (action.type) {
    case 'init': {
      return createInitialState();
    }
    case 'newEditor': {
      return {
        ...state,
        editors: [...state.editors],
      };
    }
    default: {
      console.error(`Unhandled action: ${action.type}`, action);
      return state;
    }
  }
}
