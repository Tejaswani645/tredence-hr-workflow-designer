import React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeInspector } from './components/inspector/NodeInspector';
import { workflowNodeTypes } from './components/nodes';
import { useWorkflowStore } from './hooks/useWorkflowStore';
import { NodeType, ValidationError } from './types/workflow';

export default function App() {
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedNode,
    workflowTitle,
    setWorkflowTitle,
    activeSimNodeId,
    traversedEdgeIds,
    setSelectedNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    deleteNode,
    duplicateNode,
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useWorkflowStore();

  const validationErrors: ValidationError[] = [];

  return (
    <AppLayout
      workflowTitle={workflowTitle}
      onTitleChange={setWorkflowTitle}
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={undo}
      onRedo={redo}
      onAutoLayout={() => {}}
      onOpenTemplates={() => {}}
      onOpenValidation={() => {}}
      onOpenSimulation={() => {}}
      onOpenExportImport={() => {}}
      onClearCanvas={clearCanvas}
      validationErrors={validationErrors}
      onAddNode={(type: NodeType) => addNode(type)}
      isInspectorOpen={Boolean(selectedNode)}
      inspectorPanel={
        <NodeInspector
          node={selectedNode}
          onUpdate={updateNodeData}
          onClose={() => setSelectedNodeId(null)}
          onDuplicate={duplicateNode}
          onDelete={deleteNode}
        />
      }
    >
      <WorkflowCanvas
        nodes={nodes}
        edges={edges}
        nodeTypes={workflowNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeSelect={setSelectedNodeId}
        onDropNode={(type, pos) => addNode(type, pos)}
        activeSimNodeId={activeSimNodeId}
        traversedEdgeIds={traversedEdgeIds}
      />
    </AppLayout>
  );
}
