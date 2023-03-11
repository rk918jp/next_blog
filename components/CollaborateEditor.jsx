import "@remirror/styles/all.css";
import * as Y from "yjs";
import React from "react";
import {
  PlaceholderExtension,
  DocExtension,
  CodeBlockExtension,
  YjsExtension,
} from 'remirror/extensions';
import md from 'refractor/lang/markdown.js';
import typescript from 'refractor/lang/typescript.js';
import jsx from 'refractor/lang/jsx.js';
import {WebsocketProvider} from "y-websocket";
import {
  Remirror, useHelpers,
  useRemirror,
} from "@remirror/react";

const ydoc = new Y.Doc();
const provider = new WebsocketProvider("ws://localhost:1234", "my-room", ydoc);

const extensions = () => [
  new PlaceholderExtension({placeholder: 'Open second tab and start to type...'}),
  // 全体をcodeBlockとして扱う
  new DocExtension({content: "codeBlock"}),
  // ハイライトの設定
  new CodeBlockExtension({
    supportedLanguages: [md, typescript, jsx],
    defaultLanguage: 'markdown',
    syntaxTheme: 'base16_ateliersulphurpool_light',
    defaultWrap: true,
  }),
  new YjsExtension({getProvider: () => provider}),
]

const CollaborateEditor = () => {
  const {manager, state, onChange} = useRemirror({
    extensions,
    core: {
      excludeExtensions: ["history"]
    }
  });

  return (
    <Remirror
      manager={manager}
      autoFocus
      autoRender={"end"}
      state={state}
      onChange={(params) => {
        // MDX形式の文字列
        const rawText = params.helpers.getText();
        onChange(params);
      }}
    />
  )
}

export default CollaborateEditor;