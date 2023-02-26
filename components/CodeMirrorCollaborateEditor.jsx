import * as Y from "yjs";
import {markdown, markdownLanguage} from "@codemirror/lang-markdown";
import {languages} from "@codemirror/language-data";
import ReactCodeMirror from "@uiw/react-codemirror";
import {WebsocketProvider} from "y-websocket";
import {yCollab} from "y-codemirror.next";

// TODO: 何故か初期値の復元ができない
// (Caught error while handling a Yjs update RangeError: Position 10 out of range)
const CollaborateEditor = () => {
  const yDoc = new Y.Doc();
  const provider = new WebsocketProvider("ws://localhost:1234", "my-roomname", yDoc);
  const yText = yDoc.getText("codemirror");
  const undoManager = new Y.UndoManager(yText);

  return (
    <ReactCodeMirror
      value={`## Title`}
      extensions={[
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
        yCollab(yText, provider.awareness, {undoManager})
      ]}
    />
  )
}

export default CollaborateEditor;