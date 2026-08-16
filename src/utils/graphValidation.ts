import { AppNode, AppEdge, ValidationError, NodeType } from '../types/workflow';

export interface GraphValidationReport {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  nodeErrors: Record<string, string[]>;
}

/**
 * Validates a workflow graph topology and node configuration schemas.
 */
export function validateWorkflowGraph(
  nodes: AppNode[],
  edges: AppEdge[]
): GraphValidationReport {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const nodeErrors: Record<string, string[]> = {};

  const addNodeError = (nodeId: string, message: string, severity: 'error' | 'warning' = 'error', field?: string) => {
    if (severity === 'error') {
      if (!nodeErrors[nodeId]) nodeErrors[nodeId] = [];
      nodeErrors[nodeId].push(message);
      errors.push({ nodeId, message, severity: 'error', field });
    } else {
      warnings.push({ nodeId, message, severity: 'warning', field });
    }
  };

  const addGlobalError = (message: string, severity: 'error' | 'warning' = 'error') => {
    if (severity === 'error') {
      errors.push({ message, severity: 'error' });
    } else {
      warnings.push({ message, severity: 'warning' });
    }
  };

  // 1. Structural Checks: Start and End Node counts
  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) {
    addGlobalError('Workflow must contain exactly 1 Start Node (0 found).', 'error');
  } else if (startNodes.length > 1) {
    addGlobalError(`Workflow contains multiple Start Nodes (${startNodes.length} found). Only 1 is allowed.`, 'error');
    startNodes.slice(1).forEach((sn) => {
      addNodeError(sn.id, 'Extra Start Node detected. Exactly one Start Node is allowed.', 'error');
    });
  }

  if (endNodes.length === 0) {
    addGlobalError('Workflow must contain at least 1 End Node (0 found).', 'error');
  }

  // 2. Node-Level Required Fields Validation
  nodes.forEach((node) => {
    const type = (node.type as NodeType) || 'task';
    const data = (node.data || {}) as Record<string, unknown>;

    if (type === 'start') {
      if (!data.label || !(data.label as string).trim()) {
        addNodeError(node.id, 'Start Node title is required.', 'error', 'label');
      }
    } else if (type === 'task') {
      if (!data.label || !(data.label as string).trim()) {
        addNodeError(node.id, 'Task Title is required.', 'error', 'label');
      }
      if (!data.assignee || !(data.assignee as string).trim()) {
        addNodeError(node.id, 'Task has no assignee specified.', 'warning', 'assignee');
      }
    } else if (type === 'approval') {
      if (!data.label || !(data.label as string).trim()) {
        addNodeError(node.id, 'Approval Title is required.', 'error', 'label');
      }
      if (data.approverRole === 'Custom' && (!data.customRole || !(data.customRole as string).trim())) {
        addNodeError(node.id, 'Custom Approver Role Name is required when role is set to Custom.', 'error', 'customRole');
      }
    } else if (type === 'automated') {
      if (!data.label || !(data.label as string).trim()) {
        addNodeError(node.id, 'Step Title is required.', 'error', 'label');
      }
      if (!data.actionId || !(data.actionId as string).trim()) {
        addNodeError(node.id, 'Automated Step must have an action selected.', 'error', 'actionId');
      }
    } else if (type === 'end') {
      if (!data.label || !(data.label as string).trim()) {
        addNodeError(node.id, 'End Node Title is required.', 'error', 'label');
      }
    }
  });

  // 3. Adjacency Graph Construction & Disconnection / Orphan Checks
  const nodeMap = new Map<string, AppNode>(nodes.map((n) => [n.id, n]));
  const adjacencyList = new Map<string, string[]>();
  const reverseAdjacency = new Map<string, string[]>();

  nodes.forEach((n) => {
    adjacencyList.set(n.id, []);
    reverseAdjacency.set(n.id, []);
  });

  edges.forEach((edge) => {
    if (adjacencyList.has(edge.source)) {
      adjacencyList.get(edge.source)!.push(edge.target);
    }
    if (reverseAdjacency.has(edge.target)) {
      reverseAdjacency.get(edge.target)!.push(edge.source);
    }
  });

  // Identify completely orphan nodes (no incoming and no outgoing edges)
  nodes.forEach((node) => {
    const outgoing = adjacencyList.get(node.id) || [];
    const incoming = reverseAdjacency.get(node.id) || [];

    if (outgoing.length === 0 && incoming.length === 0 && nodes.length > 1) {
      addNodeError(node.id, 'Disconnected Node: Has no input or output connections.', 'warning');
    } else {
      // Non-start node with no incoming edge
      if (node.type !== 'start' && incoming.length === 0 && nodes.length > 1) {
        addNodeError(node.id, 'Unreachable Node: No incoming flow connections from preceding steps.', 'warning');
      }
      // Non-end node with no outgoing edge
      if (node.type !== 'end' && outgoing.length === 0 && nodes.length > 1) {
        addNodeError(node.id, 'Dead-end Node: Step does not connect to any subsequent node or End termination.', 'warning');
      }
    }
  });

  // 4. Reachability from Start Node (Forward BFS)
  if (startNodes.length === 1) {
    const reachable = new Set<string>();
    const queue = [startNodes[0].id];
    reachable.add(startNodes[0].id);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!reachable.has(neighbor)) {
          reachable.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    nodes.forEach((node) => {
      if (!reachable.has(node.id) && node.type !== 'start') {
        // Only warn if not already warned as orphan
        const incoming = reverseAdjacency.get(node.id) || [];
        if (incoming.length > 0) {
          addNodeError(node.id, 'Node cannot be reached from the Start trigger path.', 'warning');
        }
      }
    });
  }

  // 5. Cycle / Circular Dependency Detection using Depth First Search (DFS)
  // 0 = unvisited, 1 = visiting (in current recursion stack), 2 = visited
  const visitState = new Map<string, number>();
  nodes.forEach((n) => visitState.set(n.id, 0));

  const cycleNodes = new Set<string>();

  const detectCycleDFS = (nodeId: string, stack: string[]): boolean => {
    visitState.set(nodeId, 1);
    stack.push(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      const state = visitState.get(neighbor) || 0;
      if (state === 1) {
        // Cycle detected
        const cycleStartIndex = stack.indexOf(neighbor);
        const cyclePath = stack.slice(cycleStartIndex).concat(neighbor);
        cyclePath.forEach((id) => cycleNodes.add(id));
        return true;
      } else if (state === 0) {
        if (detectCycleDFS(neighbor, stack)) {
          return true;
        }
      }
    }

    stack.pop();
    visitState.set(nodeId, 2);
    return false;
  };

  nodes.forEach((node) => {
    if ((visitState.get(node.id) || 0) === 0) {
      detectCycleDFS(node.id, []);
    }
  });

  if (cycleNodes.size > 0) {
    addGlobalError('Circular dependency loop detected in workflow graph topology.', 'error');
    cycleNodes.forEach((nodeId) => {
      addNodeError(nodeId, 'Part of an infinite circular dependency loop.', 'error');
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    nodeErrors,
  };
}
