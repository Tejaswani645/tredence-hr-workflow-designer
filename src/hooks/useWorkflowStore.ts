import { useState, useCallback, useRef } from 'react';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  EdgeChange,
  NodeChange,
  XYPosition,
  MarkerType,
} from '@xyflow/react';
import {
  AppNode,
  AppEdge,
  NodeType,
  WorkflowNodeData,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '../types/workflow';

// Helper to create fresh default node data for each node type
export const createDefaultNodeData = (type: NodeType): WorkflowNodeData => {
  switch (type) {
    case 'start':
      return {
        label: 'Workflow Initiation',
        triggerType: 'manual',
        metadata: [
          { key: 'department', value: 'Human Resources' },
          { key: 'source', value: 'HR Portal' },
        ],
      } as StartNodeData;

    case 'task':
      return {
        label: 'Review Candidate Documents',
        description: 'Verify identification and compliance documentation.',
        assignee: 'HR Operations Specialist',
        dueDate: '3 Business Days',
        customFields: [
          { key: 'priority', value: 'High' },
          { key: 'confidentiality', value: 'Strict' },
        ],
      } as TaskNodeData;

    case 'approval':
      return {
        label: 'Direct Manager Approval',
        approverRole: 'Manager',
        threshold: 2,
        autoApproveUnit: 'days',
      } as ApprovalNodeData;

    case 'automated':
      return {
        label: 'Send Welcome Email',
        actionId: 'send_email',
        actionParams: {
          to: '{{candidate.email}}',
          subject: 'Welcome to the Organization!',
          template: 'welcome_kit_v1',
        },
      } as AutomatedNodeData;

    case 'end':
      return {
        label: 'Workflow Completed',
        endMessage: 'All onboarding tasks and approvals completed successfully.',
        summaryFlag: true,
      } as EndNodeData;

    default:
      return { label: 'New Step' } as WorkflowNodeData;
  }
};

const INITIAL_NODES: AppNode[] = [
  {
    id: 'node-start-1',
    type: 'start',
    position: { x: 80, y: 180 },
    data: createDefaultNodeData('start'),
  },
  {
    id: 'node-task-1',
    type: 'task',
    position: { x: 380, y: 160 },
    data: createDefaultNodeData('task'),
  },
  {
    id: 'node-approval-1',
    type: 'approval',
    position: { x: 700, y: 160 },
    data: createDefaultNodeData('approval'),
  },
  {
    id: 'node-end-1',
    type: 'end',
    position: { x: 1040, y: 180 },
    data: createDefaultNodeData('end'),
  },
];

const INITIAL_EDGES: AppEdge[] = [
  {
    id: 'e-start-task',
    source: 'node-start-1',
    target: 'node-task-1',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
  },
  {
    id: 'e-task-approval',
    source: 'node-task-1',
    target: 'node-approval-1',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
  },
  {
    id: 'e-approval-end',
    source: 'node-approval-1',
    sourceHandle: 'approved',
    target: 'node-end-1',
    label: 'Approved',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
    labelStyle: { fill: '#10b981', fontWeight: 600, fontSize: 11 },
  },
];

interface HistorySnapshot {
  nodes: AppNode[];
  edges: AppEdge[];
}

export function useWorkflowStore() {
  const [nodes, setNodes] = useState<AppNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<AppEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [workflowTitle, setWorkflowTitle] = useState<string>('Employee Onboarding Process');

  // Active Simulation states
  const [activeSimNodeId, setActiveSimNodeId] = useState<string | null>(null);
  const [traversedEdgeIds, setTraversedEdgeIds] = useState<string[]>([]);

  // History for Undo / Redo
  const pastRef = useRef<HistorySnapshot[]>([]);
  const futureRef = useRef<HistorySnapshot[]>([]);
  const [, setHistoryTick] = useState(0);

  const recordHistory = useCallback(() => {
    pastRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    // Keep max 30 history states
    if (pastRef.current.length > 30) {
      pastRef.current.shift();
    }
    futureRef.current = [];
    setHistoryTick((t) => t + 1);
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const previous = pastRef.current.pop()!;
    futureRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setHistoryTick((t) => t + 1);
  }, [nodes, edges]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop()!;
    pastRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    setNodes(next.nodes);
    setEdges(next.edges);
    setHistoryTick((t) => t + 1);
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange<AppNode>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<AppEdge>[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      recordHistory();
      const isApprovedHandle = connection.sourceHandle === 'approved';
      const isRejectedHandle = connection.sourceHandle === 'rejected';

      const strokeColor = isApprovedHandle ? '#10b981' : isRejectedHandle ? '#ef4444' : '#64748b';
      const edgeLabel = isApprovedHandle ? 'Approved' : isRejectedHandle ? 'Rejected' : undefined;

      const newEdge: AppEdge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        animated: true,
        label: edgeLabel,
        style: { stroke: strokeColor, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: strokeColor },
        labelStyle: {
          fill: strokeColor,
          fontWeight: 600,
          fontSize: 11,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [recordHistory]
  );

  const addNode = useCallback(
    (type: NodeType, position?: XYPosition) => {
      recordHistory();
      const id = `node-${type}-${Date.now()}`;
      const defaultPos: XYPosition = position || {
        x: 200 + Math.random() * 200,
        y: 150 + Math.random() * 150,
      };

      const newNode: AppNode = {
        id,
        type,
        position: defaultPos,
        data: createDefaultNodeData(type),
      };

      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(id);
    },
    [recordHistory]
  );

  const updateNodeData = useCallback(
    (id: string, partialData: Partial<WorkflowNodeData>) => {
      recordHistory();
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === id) {
            return {
              ...n,
              data: {
                ...n.data,
                ...partialData,
              } as WorkflowNodeData,
            };
          }
          return n;
        })
      );
    },
    [recordHistory]
  );

  const deleteNode = useCallback(
    (id: string) => {
      recordHistory();
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      if (selectedNodeId === id) {
        setSelectedNodeId(null);
      }
    },
    [recordHistory, selectedNodeId]
  );

  const deleteEdge = useCallback(
    (id: string) => {
      recordHistory();
      setEdges((eds) => eds.filter((e) => e.id !== id));
    },
    [recordHistory]
  );

  const duplicateNode = useCallback(
    (id: string) => {
      const target = nodes.find((n) => n.id === id);
      if (!target) return;
      recordHistory();
      const newId = `node-${target.type}-${Date.now()}`;
      const newNode: AppNode = {
        ...target,
        id: newId,
        position: {
          x: target.position.x + 40,
          y: target.position.y + 40,
        },
        data: JSON.parse(JSON.stringify(target.data)),
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(newId);
    },
    [nodes, recordHistory]
  );

  const setWorkflowGraph = useCallback(
    (newNodes: AppNode[], newEdges: AppEdge[], title?: string) => {
      recordHistory();
      setNodes(newNodes);
      setEdges(newEdges);
      if (title) setWorkflowTitle(title);
      setSelectedNodeId(null);
    },
    [recordHistory]
  );

  const clearCanvas = useCallback(() => {
    recordHistory();
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  }, [recordHistory]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return {
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
    deleteEdge,
    duplicateNode,
    setWorkflowGraph,
    clearCanvas,
    undo,
    redo,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    recordHistory,
  };
}
