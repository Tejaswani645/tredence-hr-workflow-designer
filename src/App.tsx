import React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { useWorkflowStore } from './hooks/useWorkflowStore';
import { NodeType, ValidationError } from './types/workflow';

export default function App() {
  const {
    nodes,
    edges,
    selectedNodeId,
    workflowTitle,
    setWorkflowTitle,
    activeSimNodeId,
    traversedEdgeIds,
    setSelectedNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
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
      isInspectorOpen={false}
    >
      <WorkflowCanvas
        nodes={nodes}
        edges={edges}
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
