import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CheckSquare, User, Calendar, Layers, AlertCircle } from 'lucide-react';
import { TaskNodeData } from '../../types/workflow';

export const TaskNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as TaskNodeData;
  const customFieldsCount = nodeData.customFields?.length || 0;
  const validationErrors = (nodeData.__errors as string[]) || [];
  const hasErrors = validationErrors.length > 0;
  const isSimActive = Boolean(nodeData.__isSimActive);

  return (
    <div
      className={`relative min-w-[250px] max-w-[290px] rounded-xl bg-slate-900 border transition-all duration-200 shadow-lg ${
        selected ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-blue-950/50' : 'border-slate-800 hover:border-slate-700'
      } ${isSimActive ? 'animate-simulated-active ring-4 ring-blue-400' : ''} ${hasErrors ? 'border-rose-500/80 ring-2 ring-rose-500/30' : ''}`}
      style={{
        boxShadow: selected
          ? '0 10px 25px -5px rgba(59, 130, 246, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
          : '0 4px 15px -2px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Top Visual Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-xl" />

      {/* Input Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-slate-900 hover:!bg-blue-400 transition"
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
            <div className="w-6 h-6 rounded-md bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
              Task Step
            </span>
          </div>

          {nodeData.priority && (
            <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/40">
              {nodeData.priority}
            </span>
          )}
        </div>

        {/* Task Title */}
        <h3 className="text-xs font-semibold text-slate-100 line-clamp-1">
          {nodeData.label || 'Untitled Task'}
        </h3>

        {/* Task Description */}
        {nodeData.description && (
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {nodeData.description}
          </p>
        )}
      </div>

      {/* Task Meta (Assignee, Due Date, Custom fields) */}
      <div className="px-3.5 pb-3 pt-2 border-t border-slate-800/60 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-slate-300">
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <User className="w-3 h-3 text-blue-400" />
            <span className="text-slate-200 font-medium truncate max-w-[120px]">
              {nodeData.assignee || 'Unassigned'}
            </span>
          </span>

          {nodeData.dueDate && (
            <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
              <Calendar className="w-2.5 h-2.5 text-slate-400" />
              <span>{nodeData.dueDate}</span>
            </span>
          )}
        </div>

        {customFieldsCount > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-0.5">
            <Layers className="w-2.5 h-2.5 text-slate-500" />
            <span>{customFieldsCount} custom field{customFieldsCount > 1 ? 's' : ''} configured</span>
          </div>
        )}
      </div>

      {/* Output Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-slate-900 hover:!bg-blue-400 transition"
      />
    </div>
  );
};
