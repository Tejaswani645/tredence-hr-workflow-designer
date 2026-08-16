import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
  NodeMouseHandler,
  XYPosition,
  Connection,
  EdgeChange,
  NodeChange,
} from '@xyflow/react';
import { AppNode, AppEdge, NodeType } from '../../types/workflow';

interface WorkflowCanvasProps {
  nodes: AppNode[];
  edges: AppEdge[];
  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<AppEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeSelect: (id: string | null) => void;
  onDropNode: (type: NodeType, position: XYPosition) => void;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  onDeleteNode?: (id: string) => void;
  onDeleteEdge?: (id: string) => void;
  activeSimNodeId?: string | null;
  traversedEdgeIds?: string[];
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
  onDropNode,
  nodeTypes,
  edgeTypes,
  activeSimNodeId,
  traversedEdgeIds = [],
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance<AppNode, AppEdge> | null>(null);

  const onInit = useCallback((instance: ReactFlowInstance<AppNode, AppEdge>) => {
    reactFlowInstance.current = instance;
    instance.fitView({ padding: 0.2 });
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type || !reactFlowInstance.current) {
        return;
      }

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      onDropNode(type, position);
    },
    [onDropNode]
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  const handlePaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  // Color nodes dynamically in MiniMap based on their type
  const nodeColor = useCallback((node: AppNode) => {
    switch (node.type) {
      case 'start':
        return '#10b981';
      case 'task':
        return '#3b82f6';
      case 'approval':
        return '#f59e0b';
      case 'automated':
        return '#a855f7';
      case 'end':
        return '#ef4444';
      default:
        return '#64748b';
    }
  }, []);

  // Modify edges dynamically to highlight traversed path during simulation
  const styledEdges = edges.map((edge) => {
    const isTraversed = traversedEdgeIds.includes(edge.id);
    if (isTraversed) {
      return {
        ...edge,
        animated: true,
        style: {
          ...edge.style,
          stroke: '#38bdf8',
          strokeWidth: 3.5,
          filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.8))',
        },
      };
    }
    return edge;
  });

  return (
    <div ref={reactFlowWrapper} className="w-full h-full relative select-none">
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        minZoom={0.2}
        maxZoom={2.5}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#475569', strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="#1e293b"
          className="bg-[#090d16]"
        />
        <Controls
          position="bottom-left"
          className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg overflow-hidden shadow-xl"
        />
        <MiniMap
          position="bottom-right"
          nodeColor={nodeColor}
          maskColor="rgba(9, 13, 22, 0.75)"
          className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl"
          nodeStrokeWidth={2}
          zoomable
          pannable
        />
      </ReactFlow>

      {/* Floating Canvas Helper / Quick Tip */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] text-slate-400 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Drag nodes from left • Connect ports • Press Delete to remove</span>
        </div>
      </div>
    </div>
  );
};
