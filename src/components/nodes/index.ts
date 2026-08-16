import { NodeTypes } from '@xyflow/react';
import { StartNode } from './StartNode';
import { TaskNode } from './TaskNode';
import { ApprovalNode } from './ApprovalNode';
import { AutomatedStepNode } from './AutomatedStepNode';
import { EndNode } from './EndNode';

export { StartNode, TaskNode, ApprovalNode, AutomatedStepNode, EndNode };

export const workflowNodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedStepNode,
  end: EndNode,
};
