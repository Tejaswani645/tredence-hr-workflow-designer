import React, { useState } from 'react';
import {
  X,
  Copy,
  Trash2,
  Sliders,
  Code2,
  PlayCircle,
  CheckSquare,
  UserCheck,
  Bot,
  StopCircle,
} from 'lucide-react';
import {
  AppNode,
  NodeType,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  WorkflowNodeData,
} from '../../types/workflow';
import { StartConfigForm } from './forms/StartConfigForm';
import { TaskConfigForm } from './forms/TaskConfigForm';
import { ApprovalConfigForm } from './forms/ApprovalConfigForm';
import { AutomatedConfigForm } from './forms/AutomatedConfigForm';
import { EndConfigForm } from './forms/EndConfigForm';

interface NodeInspectorProps {
  node: AppNode | null;
  onUpdate: (id: string, partialData: Partial<WorkflowNodeData>) => void;
  onClose: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const TYPE_CONFIG = {
  start: {
    label: 'Start Node',
    accentColor: '#10b981',
    bgColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: PlayCircle,
  },
  task: {
    label: 'Task Node',
    accentColor: '#3b82f6',
    bgColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    icon: CheckSquare,
  },
  approval: {
    label: 'Approval Node',
    accentColor: '#f59e0b',
    bgColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: UserCheck,
  },
  automated: {
    label: 'Automated Step',
    accentColor: '#a855f7',
    bgColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    icon: Bot,
  },
  end: {
    label: 'End Node',
    accentColor: '#ef4444',
    bgColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    icon: StopCircle,
  },
};

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onUpdate,
  onClose,
  onDuplicate,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'json'>('config');

  if (!node) return null;

  const nodeType = (node.type as NodeType) || 'task';
  const meta = TYPE_CONFIG[nodeType] || TYPE_CONFIG.task;
  const Icon = meta.icon;

  const handleDataChange = (partial: Partial<WorkflowNodeData>) => {
    onUpdate(node.id, partial);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 select-none overflow-hidden">
      {/* Inspector Top Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${meta.bgColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                {meta.label}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 truncate block max-w-[140px]">
              ID: {node.id}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(node.id)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Duplicate Node"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(node.id)}
            className="p-1.5 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition"
            title="Delete Node"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-3">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
            activeTab === 'config'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Configuration</span>
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
            activeTab === 'json'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Raw JSON</span>
        </button>
      </div>

      {/* Form Content Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'config' ? (
          <div>
            {nodeType === 'start' && (
              <StartConfigForm
                data={node.data as StartNodeData}
                onChange={handleDataChange}
              />
            )}
            {nodeType === 'task' && (
              <TaskConfigForm
                data={node.data as TaskNodeData}
                onChange={handleDataChange}
              />
            )}
            {nodeType === 'approval' && (
              <ApprovalConfigForm
                data={node.data as ApprovalNodeData}
                onChange={handleDataChange}
              />
            )}
            {nodeType === 'automated' && (
              <AutomatedConfigForm
                data={node.data as AutomatedNodeData}
                onChange={handleDataChange}
              />
            )}
            {nodeType === 'end' && (
              <EndConfigForm
                data={node.data as EndNodeData}
                onChange={handleDataChange}
              />
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Node Payload Inspector</span>
              <span className="font-mono">{node.id}</span>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto">
              {JSON.stringify(node, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Inspector Footer Helper */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Changes sync automatically</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
};
