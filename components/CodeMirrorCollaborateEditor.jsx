import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { yCollab } from "y-codemirror.next";
import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";

const yDoc = new Y.Doc();
const provider = new WebsocketProvider(
  "ws://localhost:1234",
  "my-roomname",
  yDoc
);
const yText = yDoc.getText("codemirror");
const undoManager = new Y.UndoManager(yText);

const CollaborateEditor = ({ defaultValue, onChange }) => {
  const containerRef = useRef(null);
  // useEffect(() => {
  //   console.log("mount");
  //   return () => {
  //     console.log("unmount");
  //   };
  // }, []);

  useEffect(() => {
    if (containerRef.current) {
      // 自分のカーソルの設定
      // provider.awareness.setLocalStateField('user', {
      //   name: 'Anonymous ' + Math.floor(Math.random() * 100),
      //   color: userColor.color,
      //   colorLight: userColor.light
      // });

      const editorView = new EditorView({
        state: EditorState.create({
          // 本来ここにAPIから取得した値を設定するが、yjsで上書きされるのでyTextの方を設定
          // doc: defaultValue,
          doc: yText.toString(),
          extensions: [
            basicSetup,
            yCollab(yText, provider.awareness, { undoManager }),
            EditorView.updateListener.of((e) => {
              if (onChange) {
                const a = e?.state?.doc?.toString();
                onChange(a);
              }
            }),
          ],
        }),
        parent: containerRef.current,
      });

      const setDefaultVal = () => {
        // yTextが空の場合のみ設定
        if (yText.toString() === "") {
          yText.insert(0, defaultValue);
        }
      };
      // yDocがアップデートされたらログを出す(オンライン/オフライン問わず)
      const logUpdate = (update, origin, doc, transaction) => {
        console.log(update, origin, doc, transaction);
      };
      // transactionが発生したらログを出す(オンライン/オフライン問わず)
      const logTransaction = (transaction, doc) => {
        console.log(transaction, doc);
      };
      // 接続の確立/切断時にログを出す
      const logSync = (isSynced) => {
        console.log("isSynced: ", isSynced);
      };

      if (provider.synced) {
        // 既に接続出来ていたらyTextにデフォルト値をセットする
        setDefaultVal();
      } else {
        // まだ出来ていないなら接続出来た時にセットする
        provider.once("synced", setDefaultVal);
      }

      yDoc.on("afterTransaction", logTransaction);
      yDoc.on("update", logUpdate);
      provider.on("sync", logSync);

      return () => {
        // 再接続時に2回デフォルト値が設定されるのを防ぐためにイベントを解除
        provider.off("synced", setDefaultVal);
        // その他のイベントリスナも解除
        yDoc.off("afterTransaction", logTransaction);
        yDoc.off("update", logUpdate);
        provider.off("sync", logSync);
        editorView.destroy();
      };
    }
  }, [containerRef]);

  return <div ref={containerRef} />;
};

export default CollaborateEditor;
