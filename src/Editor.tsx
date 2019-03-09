import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import './monaco-gql';

function noop() {}

function processSize(size: string): string {
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

type EditorProps = {
  width: string;
  height: string;
  textModel: monaco.editor.ITextModel;
  options: monaco.editor.IEditorOptions;
};

export default function Editor(props: EditorProps) {
  const domNode = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    const el = domNode.current;
    if (!el) return;

    console.debug('Creating editor');

    const editor = monaco.editor.create(el, {
      ...props.options,
      model: props.textModel,
    });
    editorRef.current = editor;

    let debounceTimeout: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        debounceTimeout = null;
        if (editorRef.current) editorRef.current.layout();
      }, 66);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      editorRef.current = null;
      window.removeEventListener('resize', handleResize);
      editor.dispose();
      console.debug('Editor disposed');
    };
  }, [domNode.current]);

  useEffect(() => {
    if (!editorRef.current) return;
    console.debug('Editor textModel updates', props.textModel);
    editorRef.current.setModel(props.textModel);
  }, [editorRef.current, props.textModel]);

  useEffect(() => {
    if (!editorRef.current) return;
    console.debug('Editor options updates', props.options);
    editorRef.current.updateOptions(props.options);
  }, [editorRef.current, props.options]);

  const { width, height } = props;
  const fixedWidth = processSize(width);
  const fixedHeight = processSize(height);
  const style = {
    width: fixedWidth,
    height: fixedHeight,
  };

  return (
    <div
      ref={domNode}
      style={style}
      className="react-monaco-editor-container"
    />
  );
}
