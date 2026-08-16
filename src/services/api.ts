import {
  AutomationAction,
  SimulationResult,
  SimulationStep,
  WorkflowGraph,
  AppNode,
  AppEdge,
} from '../types/workflow';

/**
 * Standard Mock Automation Catalog specified by requirements
 */
export const MOCK_AUTOMATIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    description: 'Dispatches templated email notification to candidates or employees.',
    params: ['to', 'subject'],
    paramDefinitions: [
      { name: 'to', label: 'To Email Address', type: 'email', placeholder: 'candidate@company.com', required: true },
      { name: 'subject', label: 'Email Subject', type: 'string', placeholder: 'Welcome to the Team!', required: true },
    ],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    description: 'Generates dynamic PDF contracts, offer letters, or compliance documents.',
    params: ['template', 'recipient'],
    paramDefinitions: [
      { name: 'template', label: 'Document Template', type: 'template', options: ['Offer_Letter_Standard', 'Employment_Agreement_2026', 'Non_Disclosure_Agreement', 'Background_Consent'], required: true },
      { name: 'recipient', label: 'Signee Full Name', type: 'string', placeholder: 'Jordan Hayes', required: true },
    ],
  },
  {
    id: 'slack_notification',
    label: 'Send Slack Message',
    description: 'Sends announcements to HR and team Slack channels.',
    params: ['channel', 'message'],
    paramDefinitions: [
      { name: 'channel', label: 'Slack Channel Name', type: 'string', placeholder: '#hr-onboarding', required: true },
      { name: 'message', label: 'Message Body', type: 'string', placeholder: 'Please welcome the new team member!', required: true },
    ],
  },
  {
    id: 'update_hris',
    label: 'Update HRIS System',
    description: 'Syncs employee record and workflow status in Workday/BambooHR.',
    params: ['employee_id', 'status'],
    paramDefinitions: [
      { name: 'employee_id', label: 'Employee ID', type: 'string', placeholder: 'EMP-1094', required: true },
      { name: 'status', label: 'New HRIS Status', type: 'select', options: ['Active_Onboarding', 'Background_Passed', 'Approved_Leave', 'Offboarded'], required: true },
    ],
  },
  {
    id: 'provision_it_account',
    label: 'Provision IT Account',
    description: 'Creates corporate email, Okta SSO, and assigns laptop specs.',
    params: ['user_email', 'role', 'laptop_model'],
  },
  {
    id: 'create_payroll_record',
    label: 'Create Payroll Record',
    description: 'Initializes employee salary tier and direct deposit ledger.',
    params: ['employee_id', 'salary_tier', 'currency'],
  },
];

/**
 * GET /automations
 * Asynchronously returns available automated actions catalog
 */
export async function fetchAutomations(): Promise<AutomationAction[]> {
  // Simulate network request delay (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));
  return MOCK_AUTOMATIONS;
}

/**
 * Serialized Workflow Payload interface for POST /simulate
 */
export interface SimulateWorkflowPayload {
  title?: string;
  nodes: AppNode[];
  edges: AppEdge[];
  initialInputs?: Record<string, unknown>;
}

/**
 * POST /simulate
 * Accepts serialized workflow JSON graph and computes a step-by-step mock execution trace
 */
export async function simulateWorkflow(
  payload: SimulateWorkflowPayload | WorkflowGraph
): Promise<SimulationResult> {
  // Simulate mock server roundtrip latency (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const { nodes, edges, title = 'HR Workflow Execution' } = payload;
  const initialInputs =
    ('initialInputs' in payload && payload.initialInputs) || {
      candidateName: 'Jordan Hayes',
      employeeId: 'EMP-7821',
      department: 'Engineering',
      leaveDays: 3,
      salaryTier: 'L4_Senior',
    };

  const startNode = nodes.find((n) => n.type === 'start');
  if (!startNode) {
    throw new Error('Simulation failed: Graph has no Start Node.');
  }

  const steps: SimulationStep[] = [];
  const variables: Record<string, unknown> = { ...initialInputs };
  const visitedNodeIds = new Set<string>();

  let currentNode: AppNode | undefined = startNode;
  let stepIndex = 1;
  let accumulatedTimeMs = 0;

  while (currentNode && !visitedNodeIds.has(currentNode.id) && stepIndex <= 30) {
    visitedNodeIds.add(currentNode.id);
    const nodeType = currentNode.type || 'task';
    const data = currentNode.data as Record<string, unknown>;
    const nodeLabel = (data.label as string) || `Step ${stepIndex}`;

    let durationMs = 120 + Math.floor(Math.random() * 180);
    let logMessage = '';
    let decision: SimulationStep['decision'] = 'default';
    let conditionEval = '';

    switch (nodeType) {
      case 'start':
        durationMs = 45;
        logMessage = `Workflow started with trigger "${data.triggerType || 'manual'}". Initialized context payload.`;
        if (Array.isArray(data.metadata)) {
          data.metadata.forEach((item: { key: string; value: string }) => {
            if (item.key) variables[item.key] = item.value;
          });
        }
        break;

      case 'task':
        const assignee = (data.assignee as string) || 'Assigned Specialist';
        const dueDate = (data.dueDate as string) || '3 Days';
        logMessage = `Human task "${nodeLabel}" dispatched to ${assignee} (Due: ${dueDate}). Completed successfully.`;
        break;

      case 'approval':
        const role = (data.approverRole as string) || 'Manager';
        const threshold = Number(data.threshold) ?? 3;
        decision = 'approved';
        conditionEval = `Threshold <= ${threshold} evaluated TRUE -> Route to APPROVED branch.`;
        logMessage = `Approval gate evaluated by ${role}. Auto-approved under threshold SLA (${threshold} ${data.autoApproveUnit || 'days'}).`;
        break;

      case 'automated':
        const actionId = (data.actionId as string) || 'send_email';
        const params = (data.actionParams as Record<string, string>) || {};
        logMessage = `Invoked mock API action [${actionId}] with params ${JSON.stringify(params)}. Status: 200 OK.`;
        variables[`last_api_response_${actionId}`] = { status: 200, timestamp: new Date().toISOString() };
        break;

      case 'end':
        durationMs = 60;
        const summaryFlag = Boolean(data.summaryFlag);
        logMessage = `Reached termination node. Final Message: "${data.endMessage || 'Completed'}". Summary Report: ${
          summaryFlag ? 'GENERATED (Audit PDF)' : 'SKIPPED'
        }.`;
        break;
    }

    accumulatedTimeMs += durationMs;

    steps.push({
      stepIndex,
      nodeId: currentNode.id,
      nodeType: nodeType as SimulationStep['nodeType'],
      nodeLabel,
      status: 'success',
      timestamp: new Date(Date.now() + accumulatedTimeMs).toLocaleTimeString(),
      durationMs,
      logMessage,
      decision,
      evaluatedCondition: conditionEval || undefined,
      outputData: { ...variables },
    });

    stepIndex++;

    if (nodeType === 'end') {
      break;
    }

    // Determine next connected node
    let nextEdge = edges.find((e) => e.source === currentNode?.id);
    if (nodeType === 'approval') {
      // If approval, follow 'approved' handle if present
      const approvedEdge = edges.find(
        (e) => e.source === currentNode?.id && (e.sourceHandle === 'approved' || e.label === 'Approved')
      );
      if (approvedEdge) nextEdge = approvedEdge;
    }

    if (nextEdge) {
      currentNode = nodes.find((n) => n.id === nextEdge?.target);
    } else {
      currentNode = undefined;
    }
  }

  return {
    executionId: `sim_${Date.now().toString(36)}`,
    workflowTitle: title,
    status: 'completed',
    totalDurationMs: accumulatedTimeMs,
    steps,
    variables,
  };
}
