import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/platform/commands/common/commands';
import 'monaco-editor/esm/vs/basic-languages/graphql/graphql';
import 'monaco-editor/esm/vs/basic-languages/graphql/graphql.contribution';
import * as React from 'react';

function noop() {}

function processSize(size: string): string {
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

type EditorProps = {
  width: string;
  height: string;
  language: string;
  theme: string;
  options: monaco.editor.IEditorOptions;
  value: string | null;
  defaultValue: string;
  editorDidMount: (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: any,
  ) => void;
  editorWillMount: (
    monaco: any,
  ) => void | monaco.editor.IEditorConstructionOptions;
  onChange: (
    value: string,
    event: monaco.editor.IModelContentChangedEvent,
  ) => void;
};

export default class Editor extends React.Component<EditorProps> {
  static defaultProps = {
    width: '100%',
    height: '100%',
    value: null,
    defaultValue: '',
    language: 'graphql',
    theme: 'vs-dark',
    options: {},
    editorDidMount: noop,
    editorWillMount: noop,
    onChange: noop,
  };

  containerElement: HTMLDivElement | null = null;
  editor: monaco.editor.IStandaloneCodeEditor | null = null;
  __current_value: string;
  __prevent_trigger_change_event: boolean | undefined;

  constructor(props: EditorProps) {
    super(props);
    this.__current_value =
      props.value !== null ? props.value : props.defaultValue;
  }

  componentDidMount() {
    this.initMonaco();
  }

  componentDidUpdate(prevProps: any) {
    if (
      this.props.value !== null &&
      this.props.value !== this.__current_value
    ) {
      // Always refer to the latest value
      this.__current_value = this.props.value;
      // Consider the situation of rendering 1+ times before the editor mounted
      if (this.editor) {
        this.__prevent_trigger_change_event = true;
        this.editor.setValue(this.__current_value);
        this.__prevent_trigger_change_event = false;
      }
    }
    if (this.editor && prevProps.language !== this.props.language) {
      const model = this.editor.getModel();
      if (model) monaco.editor.setModelLanguage(model, this.props.language);
    }
    if (prevProps.theme !== this.props.theme) {
      monaco.editor.setTheme(this.props.theme);
    }
    if (
      this.editor &&
      (this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height)
    ) {
      this.editor.layout();
    }
    if (this.editor && prevProps.options !== this.props.options) {
      this.editor.updateOptions(this.props.options);
    }
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  assignRef = (component: HTMLDivElement | null) => {
    this.containerElement = component;
  };

  destroyMonaco() {
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }
  }

  initMonaco() {
    const value =
      this.props.value !== null ? this.props.value : this.props.defaultValue;
    const { language, theme, options } = this.props;
    if (this.containerElement) {
      // Before initializing monaco editor
      Object.assign(options, this.editorWillMount());
      this.editor = monaco.editor.create(this.containerElement, {
        value,
        language,
        selectOnLineNumbers: true,
        automaticLayout: true,
        ...options,
      });
      if (theme) {
        monaco.editor.setTheme(theme);
      }

      this.editor.addAction({
        // An unique identifier of the contributed action.
        id: 'graphql-execute',

        // A label of the action that will be presented to the user.
        label: 'Execute GraphQL',

        // An optional array of keybindings for the action.
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          // chord
          // monaco.KeyMod.chord(
          //   monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_G,
          //   monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_E,
          // ),
        ],

        // A precondition for this action.
        // precondition: null,

        // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
        // keybindingContext: null,

        /**
         * Control if the action should show up in the context menu and where.
         * The context menu of the editor has these default:
         * - navigation - The navigation group comes first in all cases.
         * - 1_modification - This group comes next and contains commands that modify your code.
         * - 9_cutcopypaste - The last default group with the basic editing commands.
         * You can also create your own group. Defaults to null (don't show in context menu).
         */
        contextMenuGroupId: 'navigation',

        contextMenuOrder: 0,

        // Method that will be executed when the action is triggered.
        // @param editor The editor instance is passed in as a convinience
        run: function(ed) {
          const position = ed.getPosition();
          const model = ed.getModel();
          if (model) {
            const text = model.getValue();
            alert(text);
            console.log('Executing query', position, text);
          }
        },
      });

      // After initializing monaco editor
      this.editorDidMount(this.editor);
    }
  }

  editorWillMount() {
    const { editorWillMount } = this.props;
    const options = editorWillMount(monaco);
    return options || {};
  }

  editorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    this.props.editorDidMount(editor, monaco);
    editor.onDidChangeModelContent(
      (event: monaco.editor.IModelContentChangedEvent) => {
        const value = editor.getValue();

        // Always refer to the latest value
        this.__current_value = value;

        // Only invoking when user input changed
        if (!this.__prevent_trigger_change_event) {
          this.props.onChange(value, event);
        }
      },
    );
  }

  render() {
    const { width, height } = this.props;
    const fixedWidth = processSize(width);
    const fixedHeight = processSize(height);
    const style = {
      width: fixedWidth,
      height: fixedHeight,
    };

    return (
      <div
        ref={this.assignRef}
        style={style}
        className="react-monaco-editor-container"
      />
    );
  }
}
