import * as React from 'react';
import { initialState, GraphiqlState } from './state';

export default React.createContext<GraphiqlState>(initialState);
