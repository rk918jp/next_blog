import * as Y from "yjs";
import {WebsocketProvider} from "y-websocket";
import {yCollab} from "y-codemirror.next";
import {useEffect, useRef} from "react";
import {EditorView, basicSetup} from "codemirror";
import {EditorState} from "@codemirror/state";

const yDoc = new Y.Doc();
const provider = new WebsocketProvider("ws://localhost:1234", "my-roomname", yDoc);
const yText = yDoc.getText("codemirror");
const undoManager = new Y.UndoManager(yText);

const CollaborateEditor = ({defaultValue, onChange}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {

      const editorView = new EditorView({
        state: EditorState.create({
          doc: defaultValue,
          extensions: [
            basicSetup,
            yCollab(yText, provider.awareness, {undoManager}),
          ]
        }),
        parent: containerRef.current,
      });
      return () => {
        editorView.destroy();
      }
    }
  }, [containerRef])

  return (
    <div ref={containerRef}/>
  )
}

export default CollaborateEditor;