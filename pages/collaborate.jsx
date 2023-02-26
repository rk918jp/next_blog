import dynamic from "next/dynamic";

// y-websocketが内部でwindow.WebSocketを参照しているため、クライアントサイドでのみimport
const CollaborateEditor = dynamic(() => import("../components/CodeMirrorCollaborateEditor"), {ssr: false});

const Collaborate = () => {
  return (
    <CollaborateEditor/>
  )
}

export default Collaborate;