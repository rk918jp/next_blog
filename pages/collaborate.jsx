import dynamic from "next/dynamic";

const CollaborateEditor = dynamic(() => import("../components/CollaborateEditor"), {ssr: false});

const Collaborate = () => {
  return (
    <CollaborateEditor/>
  )
}

export default Collaborate;