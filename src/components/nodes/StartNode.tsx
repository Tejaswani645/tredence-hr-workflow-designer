import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { PlayCircle, Tag, AlertCircle } from 'lucide-react';
import { StartNodeData } from '../../types/workflow';

export const StartNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as StartNodeData;
  const metadataList = nodeData.metadata || [];
  const validationErrors = (nodeData.__errors as string[]) || [];
  const hasErrors = validationErrors.length > 0;
  const isSimActive = Boolean(nodeData.__isSimActive);

  return (
    <div
      className={`relative min-w-[240px] max-w-[280px] rounded-xl bg-slate-900 border transition-all duration-200 shadow-lg ${
        selected ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-emerald-950/50' : 'border-slate-800 hover:border-slate-700'
      } ${isSimActive ? 'animate-simulated-active ring-4 ring-emerald-400' : ''} ${hasErrors ? 'border-rose-500/80 ring-2 ring-rose-500/30' : ''}`}
      style={{
        boxShadow: selected
          ? '0 10px 25px -5px rgba(16, 185, 129, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
          : '0 4px 15px -2px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Top Visual Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-xl" />

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
      <div className="p-3.5 pb-2.5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <PlayCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Start Trigger
            </span>
          </div>

          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
            {nodeData.triggerType || 'Manual'}
          </span>
        </div>

        {/* Node Title */}
        <h3 className="text-xs font-semibold text-slate-100 line-clamp-1">
          {nodeData.label || 'Workflow Initiation'}
        </h3>
      </div>

      {/* Metadata Preview */}
      {metadataList.length > 0 && (
        <div className="px-3.5 pb-3 pt-1 border-t border-slate-800/60 flex flex-wrap gap-1.5">
          {metadataList.slice(0, 2).map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
            >
              <Tag className="w-2.5 h-2.5 text-slate-500" />
              <span className="font-medium text-slate-400">{item.key}:</span>
              <span className="truncate max-w-[80px]">{item.value}</span>
            </span>
          ))}
          {metadataList.length > 2 && (
            <span className="text-[10px] text-slate-500 px-1 py-0.5">
              +{metadataList.length - 2} more
            </span>
          )}
        </div>
      )}

      {/* Single Output Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-slate-900 hover:!bg-emerald-400 transition"
      />
    </div>
  );
};
