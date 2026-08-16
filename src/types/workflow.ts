import { Node, Edge } from '@xyflow/react';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface StartNodeData {
  label: string;
  triggerType?: 'manual' | 'form_submission' | 'system_event' | 'schedule';
  metadata: KeyValuePair[];
  [key: string]: unknown;
}

export interface TaskNodeData {
  label: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  [key: string]: unknown;
}

export type ApproverRole = 'Manager' | 'HRBP' | 'Director' | 'Custom';

export interface ApprovalNodeData {
  label: string;
  approverRole: ApproverRole;
  customRole?: string;
  threshold: number;
  autoApproveUnit?: 'days' | 'hours' | 'score' | 'amount';
  [key: string]: unknown;
}

export interface AutomatedNodeData {
  label: string;
  actionId: string;
  actionParams: Record<string, string>;
  retryAttempts?: number;
  [key: string]: unknown;
}

export interface EndNodeData {
  label: string;
  endMessage: string;
  summaryFlag: boolean;
  notifyRoles?: string[];
  [key: string]: unknown;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type AppNode = Node<WorkflowNodeData, NodeType>;
export type AppEdge = Edge;

export interface AutomationActionParam {
  name: string;
  label: string;
  type: 'string' | 'email' | 'select' | 'template' | 'number';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface AutomationAction {
  id: string;
  label: string;
  description?: string;
  category?: 'communication' | 'documents' | 'it' | 'payroll' | 'calendar';
  params: string[];
  paramDefinitions?: AutomationActionParam[];
}

export interface ValidationError {
  nodeId?: string;
  message: string;
  severity: 'error' | 'warning';
  field?: string;
}

export interface SimulationStep {
  stepIndex: number;
  nodeId: string;
  nodeType: NodeType;
  nodeLabel: string;
  status: 'pending' | 'running' | 'success' | 'warning' | 'skipped' | 'failed';
  timestamp: string;
  durationMs: number;
  logMessage: string;
  decision?: 'approved' | 'rejected' | 'default';
  outputData?: Record<string, unknown>;
  evaluatedCondition?: string;
}

export interface SimulationResult {
  executionId: string;
  workflowTitle: string;
  status: 'completed' | 'failed' | 'cancelled';
  totalDurationMs: number;
  steps: SimulationStep[];
  variables: Record<string, unknown>;
  error?: string;
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Onboarding' | 'Leave & Absence' | 'Verification' | 'Offboarding' | 'Custom';
  nodes: AppNode[];
  edges: AppEdge[];
}

export interface WorkflowGraph {
  title: string;
  version: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  nodes: AppNode[];
  edges: AppEdge[];
}
