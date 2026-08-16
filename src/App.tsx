import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeInspector } from './components/inspector/NodeInspector';
import { WorkflowAnalyticsDrawer } from './components/analytics/WorkflowAnalyticsDrawer';
import { ValidationModal } from './components/validation/ValidationModal';
import { SandboxModal } from './components/sandbox/SandboxModal';
import { TemplatesModal } from './components/templates/TemplatesModal';
import { ExportImportModal } from './components/export/ExportImportModal';
import { workflowNodeTypes } from './components/nodes';
import { useWorkflowStore } from './hooks/useWorkflowStore';
import { validateWorkflowGraph } from './utils/graphValidation';
import { getLayoutedElements } from './utils/autoLayout';
import { NodeType, AppNode, WorkflowTemplate } from './types/workflow';

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
    setWorkflowGraph,
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useWorkflowStore();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(true);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

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

  // Dagre Auto-Layout handler
  const handleAutoLayout = useCallback(
    (direction: 'LR' | 'TB') => {
      const layouted = getLayoutedElements(nodes, edges, direction);
      setWorkflowGraph(layouted.nodes, layouted.edges);
    },
    [nodes, edges, setWorkflowGraph]
  );

  // Load Preset Template
  const handleSelectTemplate = useCallback(
    (tpl: WorkflowTemplate) => {
      setWorkflowGraph(tpl.nodes, tpl.edges, tpl.title);
    },
    [setWorkflowGraph]
  );

  // Global Keyboard Shortcuts (Undo / Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          if (canRedo) redo();
        } else {
          e.preventDefault();
          if (canUndo) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppLayout
      workflowTitle={workflowTitle}
      onTitleChange={setWorkflowTitle}
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={undo}
      onRedo={redo}
      onAutoLayout={handleAutoLayout}
      onOpenTemplates={() => setIsTemplatesOpen(true)}
      onOpenValidation={() => setIsValidationOpen(true)}
      onOpenSimulation={() => setIsSandboxOpen(true)}
      onOpenExportImport={() => setIsExportImportOpen(true)}
      onClearCanvas={clearCanvas}
      validationErrors={validationReport.errors}
      onAddNode={(type: NodeType) => addNode(type)}
      isInspectorOpen={Boolean(selectedNode)}
      isAnalyticsOpen={isAnalyticsOpen && !selectedNode}
      onToggleAnalytics={() => setIsAnalyticsOpen((prev) => !prev)}
      theme={theme}
      onToggleTheme={toggleTheme}
      isSimulating={isSandboxOpen || Boolean(activeSimNodeId)}
      inspectorPanel={
        selectedNode ? (
          <NodeInspector
            node={selectedNode}
            onUpdate={updateNodeData}
            onClose={() => setSelectedNodeId(null)}
            onDuplicate={duplicateNode}
            onDelete={deleteNode}
          />
        ) : (
          <WorkflowAnalyticsDrawer
            nodes={nodes}
            edges={edges}
            validationErrors={validationReport.errors}
          />
        )
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

      {/* Pre-built Templates Browser Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        nodes={nodes}
        edges={edges}
        workflowTitle={workflowTitle}
        onImportGraph={setWorkflowGraph}
      />
    </AppLayout>
  );
}
