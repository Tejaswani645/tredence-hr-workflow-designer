import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { UserCheck, ShieldCheck, Clock, Check, X, AlertCircle } from 'lucide-react';
import { ApprovalNodeData } from '../../types/workflow';

export const ApprovalNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as ApprovalNodeData;
  const validationErrors = (nodeData.__errors as string[]) || [];
  const hasErrors = validationErrors.length > 0;
  const isSimActive = Boolean(nodeData.__isSimActive);

  const approverLabel =
    nodeData.approverRole === 'Custom' && nodeData.customRole
      ? nodeData.customRole
      : nodeData.approverRole || 'Manager';

  return (
    <div
      className={`relative min-w-[260px] max-w-[300px] rounded-xl bg-slate-900 border transition-all duration-200 shadow-lg ${
        selected ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-amber-950/50' : 'border-slate-800 hover:border-slate-700'
      } ${isSimActive ? 'animate-simulated-active ring-4 ring-amber-400' : ''} ${hasErrors ? 'border-rose-500/80 ring-2 ring-rose-500/30' : ''}`}
      style={{
        boxShadow: selected
          ? '0 10px 25px -5px rgba(245, 158, 11, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
          : '0 4px 15px -2px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Top Visual Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-t-xl" />

      {/* Input Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-slate-900 hover:!bg-amber-400 transition"
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
            <div className="w-6 h-6 rounded-md bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Approval Gate
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">
            <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
            <span>{approverLabel}</span>
          </span>
        </div>

        {/* Node Title */}
        <h3 className="text-xs font-semibold text-slate-100 line-clamp-1">
          {nodeData.label || 'Management Approval'}
        </h3>
      </div>

      {/* Auto-Approve Threshold Display */}
      <div className="px-3.5 pb-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Auto-approve SLA:</span>
        </div>
        <span className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
          {nodeData.threshold || 0} {nodeData.autoApproveUnit || 'days'}
        </span>
      </div>

      {/* Dual Outcome Ports / Visual Labels on Right */}
      <div className="px-3 pb-2 pt-1 border-t border-slate-800/40 flex items-center justify-end gap-3 text-[9px] font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1 text-emerald-400">
          <Check className="w-2.5 h-2.5" />
          <span>Approve</span>
        </div>
        <div className="flex items-center gap-1 text-rose-400">
          <X className="w-2.5 h-2.5" />
          <span>Reject</span>
        </div>
      </div>

      {/* Dual Source Handles (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="approved"
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-slate-900 hover:!bg-emerald-400 transition"
        style={{ top: '65%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="rejected"
        className="!w-3 !h-3 !bg-rose-500 !border-2 !border-slate-900 hover:!bg-rose-400 transition"
        style={{ top: '85%' }}
      />
    </div>
  );
};
