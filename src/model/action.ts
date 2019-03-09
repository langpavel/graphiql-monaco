export type GraphiqlAction =
  | {
      type: 'noop';
    }
  | {
      type: 'init';
    }
  | {
      type: 'newEditor';
      payload?: { content: string };
    };

export type GraphiqlActionType = GraphiqlAction['type'];
