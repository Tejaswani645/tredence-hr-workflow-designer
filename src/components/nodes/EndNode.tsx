import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { StopCircle, FileCheck, AlertCircle } from 'lucide-react';
import { EndNodeData } from '../../types/workflow';

export const EndNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as EndNodeData;
  const validationErrors = (nodeData.__errors as string[]) || [];
  const hasErrors = validationErrors.length > 0;
  const isSimActive = Boolean(nodeData.__isSimActive);

  return (
    <div
      className={`relative min-w-[240px] max-w-[280px] rounded-xl bg-slate-900 border transition-all duration-200 shadow-lg ${
        selected ? 'border-rose-500 ring-2 ring-rose-500/30 shadow-rose-950/50' : 'border-slate-800 hover:border-slate-700'
      } ${isSimActive ? 'animate-simulated-active ring-4 ring-rose-400' : ''} ${hasErrors ? 'border-rose-500/80 ring-2 ring-rose-500/30' : ''}`}
      style={{
        boxShadow: selected
          ? '0 10px 25px -5px rgba(239, 68, 68, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
          : '0 4px 15px -2px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Top Visual Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-red-600 rounded-t-xl" />

      {/* Input Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-rose-500 !border-2 !border-slate-900 hover:!bg-rose-400 transition"
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
            <div className="w-6 h-6 rounded-md bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <StopCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 font-mono">
              Termination
            </span>
          </div>

          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
            Final Step
          </span>
        </div>

        {/* Node Title */}
        <h3 className="text-xs font-semibold text-slate-100 line-clamp-1">
          {nodeData.label || 'Workflow End'}
        </h3>

        {/* End Message */}
        {nodeData.endMessage && (
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {nodeData.endMessage}
          </p>
        )}
      </div>

      {/* Summary Flag Status Chip */}
      <div className="px-3.5 pb-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <FileCheck className="w-3 h-3 text-rose-400" />
          <span>Audit Summary:</span>
        </div>
        <span
          className={`font-semibold px-2 py-0.5 rounded border text-[10px] ${
            nodeData.summaryFlag
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {nodeData.summaryFlag ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </div>
  );
};
