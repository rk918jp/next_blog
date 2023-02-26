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
import {WebsocketProvider} from "y-websocket";
import {
  Remirror,
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
    supportedLanguages: [md, typescript],
    defaultLanguage: 'markdown',
    syntaxTheme: 'base16_ateliersulphurpool_light',
    defaultWrap: true,
  }),
  new YjsExtension({getProvider: () => provider}),
]

const CollaborateEditor = () => {
  const {manager} = useRemirror({
    extensions,
    core: {
      excludeExtensions: ["history"]
    }
  })

  return (
    <Remirror manager={manager} autoFocus autoRender={"end"}></Remirror>
  )
}

export default CollaborateEditor;