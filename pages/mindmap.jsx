import React, {useCallback, useEffect, useMemo, useState, useRef, memo} from "react";
import {MainLayout} from "../components/MainLayout";
import {Paper, Box, TextField, ClickAwayListener} from "@mui/material";
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
  Panel,
} from "reactflow";
import 'reactflow/dist/style.css';
import {SketchPicker} from "react-color";

const DefaultBgColor = "#ffffff";
const DefaultColor = "#222222";

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
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const {getIntersectingNodes, project} = useReactFlow();
  const [copyNode, setCopyNode] = useState();
  const [openBgColorPicker, setOpenBgColorPicker] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  // TODO: keyPress hookが効かないことがあるので載せ替え
  const newPressed = useKeyPress("n");
  const copyPressed = useKeyPress("Meta+c");
  const pastePressed = useKeyPress("Meta+v");
  const selectedNode = useMemo(() => {
    return nodes?.find((n) => n.selected);
  }, [nodes]);
  const selectedEdge = useMemo(() => {
    return edges?.find((e) => e.selected);
  }, [edges]);

  const getId = () => {
    return String(Date.now());
  }

  // add
  useEffect(() => {
    if (newPressed) {
      setNodes((nodes) => nodes.concat({
          id: getId(),
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
          id: getId(),
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

  const onConnect = useCallback((params) =>
      setEdges((eds) => addEdge(params, eds))
    , []);

  const onConnectStart = useCallback((_, {nodeId}) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane');
      if (targetIsPane) {
        const {top, left} = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id,
          position: project({x: event.clientX - left - 75, y: event.clientY - top}),
          data: {label: "Node"},
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({id, source: connectingNodeId.current, target: id}));
      }
    },
    [project]
  );

  return (
    <Box
      sx={{width: "100%", height: "100%"}}
      ref={reactFlowWrapper}
    >
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
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
      >
        <Panel position="top-right">
          <Box
            sx={{
              m: 1,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label={"Label"}
              size={"small"}
              disabled={!selectedNode && !selectedEdge}
              value={selectedNode?.data.label ?? selectedEdge?.label ?? ""}
              onChange={(event) => {
                if (selectedNode) {
                  setNodes(ns => ns.map(n => n.id === selectedNode.id ? {
                    ...n,
                    data: {
                      ...n.data,
                      label: event.target.value,
                    },
                  } : n));
                } else if (selectedEdge) {
                  setEdges(es => es.map(e => e.id === selectedEdge.id ? {
                    ...e,
                    label: event.target.value,
                  } : e));
                }
              }}
            />
            <ClickAwayListener onClickAway={() => {
              setOpenBgColorPicker(false);
            }}>
              <Box>
                <TextField
                  label={"Background"}
                  size={"small"}
                  sx={{width: 220}}
                  disabled={!selectedNode}
                  value={selectedNode ? selectedNode?.style?.backgroundColor ?? DefaultBgColor : ""}
                  onFocus={() => {
                    if (selectedNode) {
                      setOpenBgColorPicker(true);
                    }
                  }}
                />
                {openBgColorPicker && (
                  <SketchPicker
                    styles={{
                      picker: {
                        zIndex: 1,
                        width: 220,
                        marginTop: 10,
                        display: openBgColorPicker ? "block" : "none",
                      }
                    }}
                    color={selectedNode?.style?.backgroundColor ?? DefaultBgColor}
                    onChange={(color) => {
                      if (selectedNode) {
                        setNodes(ns => ns.map(n => n.id === selectedNode.id ? {
                          ...n,
                          style: {
                            ...n.style,
                            backgroundColor: color.hex,
                          }
                        } : n));
                      }
                    }}
                  />
                )}
              </Box>
            </ClickAwayListener>
            <ClickAwayListener onClickAway={() => {
              setOpenColorPicker(false);
            }}>
              <Box>
                <TextField
                  label={"Color"}
                  size={"small"}
                  sx={{width: 220}}
                  disabled={!selectedNode}
                  value={selectedNode ? selectedNode?.style?.color ?? DefaultColor : ""}
                  onFocus={() => {
                    if (selectedNode) {
                      setOpenColorPicker(true);
                    }
                  }}
                />
                {openColorPicker && (
                  <SketchPicker
                    styles={{
                      picker: {
                        zIndex: 1,
                        width: 220,
                        marginTop: 10,
                        display: openColorPicker ? "block" : "none",
                      }
                    }}
                    color={selectedNode?.style?.color ?? DefaultColor}
                    onChange={(color) => {
                      if (selectedNode) {
                        setNodes(ns => ns.map(n => n.id === selectedNode.id ? {
                          ...n,
                          style: {
                            ...n.style,
                            color: color.hex,
                          }
                        } : n));
                      }
                    }}
                  />
                )}
              </Box>
            </ClickAwayListener>
          </Box>
        </Panel>
        <MiniMap style={{
          height: 120,
        }} zoomable pannable/>
        <Controls/>
        <Background color={"#aaa"}/>
      </ReactFlow>
    </Box>
  )
}

export default MindMapPage;