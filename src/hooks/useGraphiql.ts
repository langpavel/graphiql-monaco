import { useContext } from 'react';
import Context from '../model/Context';

export function useGraphiql() {
  return useContext(Context);
}
