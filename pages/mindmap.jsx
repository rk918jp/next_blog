import React, {useCallback, useEffect, useMemo, useState, useRef, memo} from "react";
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
  Handle,
  Position,
} from "reactflow";
import 'reactflow/dist/style.css';

// Custom Node
const ContainerNode = ({
                         data,
                         isConnectable,
                         targetPosition = Position.Top,
                         sourcePosition = Position.Bottom,
                       }) => {
  return (
    <>
      <Handle type="target" position={targetPosition} isConnectable={isConnectable}/>
      {data?.label}
      <Handle type="source" position={sourcePosition} isConnectable={isConnectable}/>
    </>
  );
};
ContainerNode.displayName = "ContainerNode";

const nodeTypes = {
  container: memo(ContainerNode),
};

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
    type: "container",
    data: {
      label: 'GroupA',
    },
    position: {x: 250, y: 100},
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
      <Paper sx={{height: 600}}>
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
      setCopyNode(selectedNode);
    }
  }, [copyPressed, selectedNode]);

  // paste
  useEffect(() => {
    if (pastePressed && copyNode) {
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

  // ホバー時のクラス付与
  const onNodeDrag = useCallback((e, node) => {
    const intersections = getIntersectingNodes(node).map((n) => n.id);
    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: intersections.includes(n.id) ? 'highlight' : '',
      }))
    );
  }, []);

  // ホバー時のクラス削除
  // グルーピング
  const onNodeDragStop = useCallback((e, node) => {
    const intersections = getIntersectingNodes(node).map((n) => n.id);
    const container = intersections
      .map(id => nodes.find(n => n.id === id))
      .find(n => n?.type === "container");
    const isDetached = node.parentNode && !container;
    const isAttached = !node.parentNode && container;
    const newPosition = isAttached ? {
      x: node.positionAbsolute.x - container.position.x,
      y: node.positionAbsolute.y - container.position.y,
    } : isDetached ? {
      x: node.positionAbsolute.x,
      y: node.positionAbsolute.y,
    } : node.position;

    setNodes((ns) =>
      ns.map((n) => {
        const isTarget = n.id === node.id;
        return {
          ...n,
          className: (n.className ?? "").replace("highlight", ""),
          parentNode: isTarget ? container?.id : n.parentNode,
          position: isTarget ? newPosition : n.position,
        };
      })
    );
  }, [nodes]);

  return (
    <ReactFlow
      fitView
      attributionPosition="top-right"
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
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