import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Bot, Zap, Settings2, AlertCircle } from 'lucide-react';
import { AutomatedNodeData } from '../../types/workflow';

const ACTION_LABELS: Record<string, string> = {
  send_email: 'Send Email',
  generate_doc: 'Generate Document',
  slack_notification: 'Slack Alert',
  provision_it_account: 'Provision IT Account',
  create_payroll_record: 'Payroll Setup',
  schedule_calendar_event: 'Schedule Event',
};

export const AutomatedStepNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as AutomatedNodeData;
  const actionId = nodeData.actionId || 'send_email';
  const actionLabel = ACTION_LABELS[actionId] || actionId;
  const paramsCount = Object.keys(nodeData.actionParams || {}).length;

  const validationErrors = (nodeData.__errors as string[]) || [];
  const hasErrors = validationErrors.length > 0;
  const isSimActive = Boolean(nodeData.__isSimActive);

  return (
    <div
      className={`relative min-w-[260px] max-w-[300px] rounded-xl bg-slate-900 border transition-all duration-200 shadow-lg ${
        selected ? 'border-purple-500 ring-2 ring-purple-500/30 shadow-purple-950/50' : 'border-slate-800 hover:border-slate-700'
      } ${isSimActive ? 'animate-simulated-active ring-4 ring-purple-400' : ''} ${hasErrors ? 'border-rose-500/80 ring-2 ring-rose-500/30' : ''}`}
      style={{
        boxShadow: selected
          ? '0 10px 25px -5px rgba(168, 85, 247, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
          : '0 4px 15px -2px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Top Visual Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-xl" />

      {/* Input Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-slate-900 hover:!bg-purple-400 transition"
      />

      {/* Validation Error Badge */}
      {hasErrors && (
        <div
          className="absolute -top-2.5 -right-2.5 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-md shadow-rose-900/50 animate-bounce"
          title={validationErrors.join('\n')}
        >
          <AlertCircle className="w-3 h-3" />
          <span>{validationErrors.length}</span>
        </div>
      )}

      {/* Node Header */}
      <div className="p-3.5 pb-2">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
              Mock API Step
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40">
            <Zap className="w-2.5 h-2.5 text-purple-400" />
            <span>{actionLabel}</span>
          </span>
        </div>

        {/* Node Title */}
        <h3 className="text-xs font-semibold text-slate-100 line-clamp-1">
          {nodeData.label || 'Automated Integration'}
        </h3>
      </div>

      {/* Parameter Status Indicator */}
      <div className="px-3.5 pb-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Settings2 className="w-3 h-3 text-purple-400" />
          <span>Dynamic Parameters:</span>
        </div>
        <span className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
          {paramsCount} configured
        </span>
      </div>

      {/* Output Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-slate-900 hover:!bg-purple-400 transition"
      />
    </div>
  );
};
