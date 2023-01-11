import React, {useCallback, useEffect, useMemo, useState, useRef} from "react";
import {MainLayout} from "../components/MainLayout";
import {Paper} from "@mui/material";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  useKeyPress,
  useReactFlow,
  updateEdge,
  ReactFlowProvider,
} from "reactflow";
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: "input",
    data: {
      label: "Input Node",
    },
    position: {x: 250, y: 0},
  },
  {
    id: '2',
    data: {
      label: 'GroupA',
    },
    position: {x: 250, y: 100},
    style: {backgroundColor: "rgba(255, 0, 0, 0.2)", width: 200, height: 200}
  },
  {
    id: "2a",
    data: {
      label: 'Sample Node',
    },
    position: {x: 10, y: 100},
    parentNode: "2",
  },
  {
    id: "3",
    data: {
      label: 'Sample Node2',
    },
    position: {x: 250, y: 400},
  },
];
// nodeを繋ぐ線の初期値
const initialEdges = [
  {
    id: "a",
    source: "1",
    target: "2",
    label: "test",
  },
  {
    id: "b",
    source: "2",
    target: "3",
  }
];

const MindMapPage = (props) => {
  return (
    <MainLayout>
      <Paper sx={{
        height: 600
      }}>
        <ReactFlowProvider>
          <Flow/>
        </ReactFlowProvider>
      </Paper>
    </MainLayout>
  )
}

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const {getIntersectingNodes} = useReactFlow();
  const [copyNode, setCopyNode] = useState();
  // TODO: keyPress hookが効かないことがあるので載せ替え
  const newPressed = useKeyPress("n");
  const copyPressed = useKeyPress("Meta+c");
  const pastePressed = useKeyPress("Meta+v");

  const onConnect = useCallback((params) =>
      setEdges((eds) => addEdge(params, eds))
    , []);
  const selectedNode = useMemo(() => {
    return nodes?.find((node) => node.selected);
  }, [nodes]);

  // add
  useEffect(() => {
    if (newPressed) {
      setNodes((nodes) => nodes.concat({
          id: String(Date.now()),
          data: {
            label: "test",
          },
          position: {x: 0, y: 0}
        })
      )
    }
  }, [newPressed]);

  // copy
  useEffect(() => {
    if (copyPressed && selectedNode) {
      console.log("copy", selectedNode)
      setCopyNode(selectedNode);
    }
  }, [copyPressed, selectedNode]);

  // paste
  useEffect(() => {
    if (pastePressed && copyNode) {
      console.log("paste", copyNode)
      setNodes((nodes) => nodes.concat({
          ...copyNode,
          id: String(Date.now()),
          selected: false,
          position: {
            x: selectedNode.position.x + 10,
            y: selectedNode.position.y + 10,
          }
        })
      )
    }
  }, [pastePressed, copyNode]);

  // edgeの削除
  const edgeUpdateSuccessful = useRef(true);
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);
  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);
  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, []);

  const onNodeDrag = useCallback((e, node) => {
    const intersections = getIntersectingNodes(node).map((n) => n.id);

    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: intersections.includes(n.id) ? 'highlight' : '',
      }))
    );
  }, []);

  return (
    <ReactFlow
      fitView
      attributionPosition="top-right"
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgeUpdate={onEdgeUpdate}
      onEdgeUpdateStart={onEdgeUpdateStart}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
    >
      <MiniMap style={{
        height: 120,
      }} zoomable pannable/>
      <Controls/>
      <Background color={"#aaa"}/>
    </ReactFlow>
  )
}

export default MindMapPage;