import React, { useMemo, useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeInspector } from './components/inspector/NodeInspector';
import { ValidationModal } from './components/validation/ValidationModal';
import { SandboxModal } from './components/sandbox/SandboxModal';
import { workflowNodeTypes } from './components/nodes';
import { useWorkflowStore } from './hooks/useWorkflowStore';
import { validateWorkflowGraph } from './utils/graphValidation';
import { NodeType, AppNode } from './types/workflow';

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
    setActiveSimNodeId,
    setTraversedEdgeIds,
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

  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  // Compute live validation report
  const validationReport = useMemo(() => {
    return validateWorkflowGraph(nodes, edges);
  }, [nodes, edges]);

  // Inject __errors and __isSimActive flags into nodes for visual badge rendering
  const enrichedNodes = useMemo(() => {
    return nodes.map((node) => {
      const errors = validationReport.nodeErrors[node.id] || [];
      const isSimActive = node.id === activeSimNodeId;
      return {
        ...node,
        data: {
          ...node.data,
          __errors: errors,
          __isSimActive: isSimActive,
        },
      } as AppNode;
    });
  }, [nodes, validationReport.nodeErrors, activeSimNodeId]);

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
      onOpenValidation={() => setIsValidationOpen(true)}
      onOpenSimulation={() => setIsSandboxOpen(true)}
      onOpenExportImport={() => {}}
      onClearCanvas={clearCanvas}
      validationErrors={validationReport.errors}
      onAddNode={(type: NodeType) => addNode(type)}
      isInspectorOpen={Boolean(selectedNode)}
      isSimulating={isSandboxOpen || Boolean(activeSimNodeId)}
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
        nodes={enrichedNodes}
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

      {/* Validation Health Report Modal */}
      <ValidationModal
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
        errors={validationReport.errors}
        warnings={validationReport.warnings}
        nodes={nodes}
        onSelectNode={(id) => {
          setSelectedNodeId(id);
          setIsValidationOpen(false);
        }}
      />

      {/* Workflow Sandbox Modal */}
      <SandboxModal
        isOpen={isSandboxOpen}
        onClose={() => {
          setIsSandboxOpen(false);
          setActiveSimNodeId(null);
          setTraversedEdgeIds([]);
        }}
        nodes={nodes}
        edges={edges}
        workflowTitle={workflowTitle}
        validationErrors={validationReport.errors}
        onHighlightNode={setActiveSimNodeId}
        onHighlightEdges={setTraversedEdgeIds}
      />
    </AppLayout>
  );
}
