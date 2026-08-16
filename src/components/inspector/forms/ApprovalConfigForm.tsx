import React from 'react';
import { ApprovalNodeData, ApproverRole } from '../../../types/workflow';

interface ApprovalConfigFormProps {
  data: ApprovalNodeData;
  onChange: (partial: Partial<ApprovalNodeData>) => void;
}

export const ApprovalConfigForm: React.FC<ApprovalConfigFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">
          Approval Title <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="e.g. Department Head Approval"
          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
        />
      </div>

      {/* Approver Role */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Approver Role</label>
        <select
          value={data.approverRole || 'Manager'}
          onChange={(e) =>
            onChange({
              approverRole: e.target.value as ApproverRole,
            })
          }
          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
        >
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP (HR Business Partner)</option>
          <option value="Director">Director</option>
          <option value="Custom">Custom Role / Title</option>
        </select>
      </div>

      {/* Custom Role Input */}
      {data.approverRole === 'Custom' && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Custom Approver Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={data.customRole || ''}
            onChange={(e) => onChange({ customRole: e.target.value })}
            placeholder="e.g. VP of People Operations"
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
          />
        </div>
      )}

      {/* Auto-approve threshold */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Auto-Approve Threshold</label>
          <input
            type="number"
            min={0}
            value={data.threshold ?? 3}
            onChange={(e) => onChange({ threshold: Number(e.target.value) })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Threshold Unit</label>
          <select
            value={data.autoApproveUnit || 'days'}
            onChange={(e) =>
              onChange({
                autoApproveUnit: e.target.value as ApprovalNodeData['autoApproveUnit'],
              })
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
          >
            <option value="days">Days Elapsed</option>
            <option value="hours">Hours Elapsed</option>
            <option value="amount">Budget Amount (USD)</option>
            <option value="score">Risk Score</option>
          </select>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/80 leading-relaxed">
        <span className="font-semibold text-amber-300">Conditional Output Logic:</span> This node exposes two distinct exit handles on the canvas: <strong className="text-emerald-300">Approved</strong> and <strong className="text-rose-300">Rejected</strong>.
      </div>
    </div>
  );
};
