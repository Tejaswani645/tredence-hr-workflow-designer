import { AutomationAction, SimulationResult, SimulationStep, AppNode, AppEdge } from '../types/workflow';

export const MOCK_AUTOMATION_ACTIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    description: 'Dispatches automated templated email notification to candidates or staff.',
    category: 'communication',
    params: ['to', 'subject', 'template', 'cc'],
    paramDefinitions: [
      { name: 'to', label: 'Recipient Email', type: 'email', placeholder: 'candidate@company.com', required: true },
      { name: 'subject', label: 'Email Subject', type: 'string', placeholder: 'Welcome to the Team!', required: true },
      { name: 'template', label: 'Email Template', type: 'template', options: ['welcome_kit_v1', 'offer_letter_template', 'interview_invite', 'policy_acknowledgment'], required: true },
      { name: 'cc', label: 'CC Recipient', type: 'email', placeholder: 'manager@company.com' },
    ],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    description: 'Renders formal PDF documents (Employment Agreements, NDAs, Letters).',
    category: 'documents',
    params: ['template', 'recipient', 'format'],
    paramDefinitions: [
      { name: 'template', label: 'Document Template', type: 'template', options: ['Standard_NDA_2026', 'FullTime_Contract', 'Relocation_Agreement', 'Exit_Clearance'], required: true },
      { name: 'recipient', label: 'Signee Full Name', type: 'string', placeholder: 'Jane Doe', required: true },
      { name: 'format', label: 'Export Format', type: 'select', options: ['PDF/A', 'DocuSign_Envelope', 'Encrypted_PDF'] },
    ],
  },
  {
    id: 'slack_notification',
    label: 'Slack Notification',
    description: 'Sends real-time announcements to specific Slack channels.',
    category: 'communication',
    params: ['channel', 'message', 'urgent'],
    paramDefinitions: [
      { name: 'channel', label: 'Slack Channel', type: 'string', placeholder: '#hr-onboarding-alerts', required: true },
      { name: 'message', label: 'Notification Message', type: 'string', placeholder: 'New team member accepted offer!', required: true },
      { name: 'urgent', label: 'Priority Alert', type: 'select', options: ['true', 'false'] },
    ],
  },
  {
    id: 'provision_it_account',
    label: 'Provision IT Account',
    description: 'Creates Google Workspace, Okta SSO, and assigns default permission bundles.',
    category: 'it',
    params: ['user_email', 'role', 'laptop_model'],
    paramDefinitions: [
      { name: 'user_email', label: 'New Work Email', type: 'email', placeholder: 'first.last@company.com', required: true },
      { name: 'role', label: 'IT Access Role', type: 'select', options: ['Standard_Employee', 'Engineering_Dev', 'Finance_Admin', 'Executive'] },
      { name: 'laptop_model', label: 'Hardware Spec', type: 'select', options: ['MacBook Pro M3 16"', 'MacBook Air 15"', 'ThinkPad X1 Carbon'] },
    ],
  },
  {
    id: 'create_payroll_record',
    label: 'Create Payroll Record',
    description: 'Initializes employee record in Workday/Gusto payroll engine.',
    category: 'payroll',
    params: ['employee_id', 'salary_tier', 'currency'],
    paramDefinitions: [
      { name: 'employee_id', label: 'Employee ID', type: 'string', placeholder: 'EMP-9082', required: true },
      { name: 'salary_tier', label: 'Salary Band', type: 'select', options: ['Band_L4_Senior', 'Band_L5_Staff', 'Band_L6_Principal', 'Band_Executive'] },
      { name: 'currency', label: 'Payroll Currency', type: 'select', options: ['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)'] },
    ],
  },
  {
    id: 'schedule_calendar_event',
    label: 'Schedule Calendar Event',
    description: 'Books welcome orientation or 1-on-1 check-ins on Google Calendar.',
    category: 'calendar',
    params: ['organizer', 'attendees', 'duration_mins'],
    paramDefinitions: [
      { name: 'organizer', label: 'Host Email', type: 'email', placeholder: 'hr-coordinator@company.com', required: true },
      { name: 'attendees', label: 'Attendees (comma-separated)', type: 'string', placeholder: 'candidate@company.com, manager@company.com' },
      { name: 'duration_mins', label: 'Duration (Minutes)', type: 'number', placeholder: '45' },
    ],
  },
];

/**
 * Mock API service simulating GET /automations
 */
export async function getAutomations(): Promise<AutomationAction[]> {
  // Simulate network latency (200ms)
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_AUTOMATION_ACTIONS;
}

/**
 * Mock API service simulating POST /simulate
 */
export async function simulateWorkflow(
  nodes: AppNode[],
  edges: AppEdge[],
  workflowTitle: string,
  initialVariables: Record<string, unknown> = {}
): Promise<SimulationResult> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const startNode = nodes.find((n) => n.type === 'start');
  if (!startNode) {
    throw new Error('Simulation failed: Workflow must contain a Start Node.');
  }

  const steps: SimulationStep[] = [];
  const variables: Record<string, unknown> = {
    ...initialVariables,
    candidateName: initialVariables.candidateName || 'Jordan Hayes',
    department: initialVariables.department || 'Product Engineering',
    role: initialVariables.role || 'Senior Frontend Architect',
    startDate: '2026-09-01',
  };

  let currentNode: AppNode | undefined = startNode;
  const visitedNodeIds = new Set<string>();
  let stepCounter = 1;
  let totalDurationMs = 0;

  while (currentNode && !visitedNodeIds.has(currentNode.id) && stepCounter <= 25) {
    visitedNodeIds.add(currentNode.id);
    const nodeType = currentNode.type || 'task';
    const data = currentNode.data as Record<string, unknown>;
    const nodeLabel = (data.label as string) || `Step ${stepCounter}`;

    let duration = 150 + Math.floor(Math.random() * 200);
    let logMessage = '';
    let decision: SimulationStep['decision'] = 'default';

    if (nodeType === 'start') {
      duration = 50;
      logMessage = `Trigger initialized: ${nodeLabel}. Context loaded for ${variables.candidateName}.`;
    } else if (nodeType === 'task') {
      const assignee = (data.assignee as string) || 'Unassigned';
      logMessage = `Dispatched task "${nodeLabel}" to ${assignee}. Completed within SLA.`;
    } else if (nodeType === 'approval') {
      const role = (data.approverRole as string) || 'Manager';
      const threshold = Number(data.threshold) || 3;
      decision = 'approved';
      logMessage = `Approval gate passed by ${role} (Auto-approved under ${threshold} days threshold).`;
    } else if (nodeType === 'automated') {
      const actionId = (data.actionId as string) || 'send_email';
      const params = (data.actionParams as Record<string, string>) || {};
      logMessage = `Executed Mock API Action "${actionId}" with parameters: ${JSON.stringify(params)}. HTTP 200 OK.`;
    } else if (nodeType === 'end') {
      duration = 80;
      const hasSummary = Boolean(data.summaryFlag);
      logMessage = `Workflow finalized. Summary Report generated: ${hasSummary ? 'YES (Audit PDF created)' : 'NO'}.`;
    }

    totalDurationMs += duration;

    steps.push({
      stepIndex: stepCounter,
      nodeId: currentNode.id,
      nodeType: nodeType as SimulationStep['nodeType'],
      nodeLabel,
      status: 'success',
      timestamp: new Date(Date.now() + totalDurationMs).toLocaleTimeString(),
      durationMs: duration,
      logMessage,
      decision,
      outputData: { ...variables, lastCompletedStep: nodeLabel },
    });

    stepCounter++;

    if (nodeType === 'end') {
      break;
    }

    // Find outgoing edge
    let outgoingEdge = edges.find((e) => e.source === currentNode?.id);
    if (nodeType === 'approval') {
      // Prioritize approved branch
      const approvedEdge = edges.find((e) => e.source === currentNode?.id && (e.sourceHandle === 'approved' || e.label === 'Approved'));
      if (approvedEdge) {
        outgoingEdge = approvedEdge;
      }
    }

    if (outgoingEdge) {
      currentNode = nodes.find((n) => n.id === outgoingEdge?.target);
    } else {
      currentNode = undefined;
    }
  }

  return {
    executionId: `sim-run-${Date.now().toString(36)}`,
    workflowTitle,
    status: 'completed',
    totalDurationMs,
    steps,
    variables,
  };
}
