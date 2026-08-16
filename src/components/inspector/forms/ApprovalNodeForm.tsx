import React from 'react';
import { ApprovalNodeData, ApproverRole } from '../../../types/workflow';
import { ShieldCheck, CheckCircle2, AlertCircle, Clock, GitFork } from 'lucide-react';

interface ApprovalNodeFormProps {
  data: ApprovalNodeData;
  onChange: (partial: Partial<ApprovalNodeData>) => void;
}

export const ApprovalNodeForm: React.FC<ApprovalNodeFormProps> = ({ data, onChange }) => {
  const isTitleValid = Boolean(data.label && data.label.trim().length > 0);
  const isCustomRoleValid =
    data.approverRole !== 'Custom' || Boolean(data.customRole && data.customRole.trim().length > 0);

  const thresholdValue = data.threshold ?? 3;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Approval Title <span className="text-rose-400">*</span>
          </label>
          {isTitleValid ? (
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Valid
            </span>
          ) : (
            <span className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Title required
            </span>
          )}
        </div>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="e.g. Line Manager Approval Gate"
          className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition ${
            !isTitleValid
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
          }`}
        />
      </div>

      {/* Approver Role */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Approver Role</label>
        <div className="relative">
          <ShieldCheck className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-amber-400" />
          <select
            value={data.approverRole || 'Manager'}
            onChange={(e) =>
              onChange({
                approverRole: e.target.value as ApproverRole,
              })
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-200 outline-none transition"
          >
            <option value="Manager">Direct Line Manager</option>
            <option value="HRBP">HRBP (Human Resources Business Partner)</option>
            <option value="Director">Department Director / VP</option>
            <option value="Custom">Custom Role Definition</option>
          </select>
        </div>
      </div>

      {/* Custom Role Input */}
      {data.approverRole === 'Custom' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Custom Approver Role Name <span className="text-rose-400">*</span>
            </label>
            {!isCustomRoleValid && (
              <span className="text-[10px] text-rose-400">Role name required</span>
            )}
          </div>
          <input
            type="text"
            value={data.customRole || ''}
            onChange={(e) => onChange({ customRole: e.target.value })}
            placeholder="e.g. Chief People Officer"
            className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition ${
              !isCustomRoleValid
                ? 'border-rose-500/80 focus:border-rose-500'
                : 'border-slate-800 focus:border-amber-500'
            }`}
          />
        </div>
      )}

      {/* Auto-approve Threshold Number Slider & Unit */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-Approve SLA Threshold</span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
            {thresholdValue} {data.autoApproveUnit || 'days'}
          </span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={0}
          max={30}
          step={1}
          value={thresholdValue}
          onChange={(e) => onChange({ threshold: Number(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0 (Instant)</span>
          <span>15 days</span>
          <span>30 days</span>
        </div>

        {/* Unit Selector */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400">Threshold Measurement Unit</label>
          <select
            value={data.autoApproveUnit || 'days'}
            onChange={(e) =>
              onChange({
                autoApproveUnit: e.target.value as ApprovalNodeData['autoApproveUnit'],
              })
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none transition"
          >
            <option value="days">Days Elapsed</option>
            <option value="hours">Hours Elapsed</option>
            <option value="amount">Budget Amount (USD)</option>
            <option value="score">Risk Score Threshold</option>
          </select>
        </div>
      </div>

      {/* Branching Logic Explainer */}
      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <GitFork className="w-3.5 h-3.5 text-amber-400" />
          <span>Branching Exit Ports</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Connect the <strong className="text-emerald-400">Approved</strong> handle (top) for standard pass flow, and the <strong className="text-rose-400">Rejected</strong> handle (bottom) for escalation or termination branches.
        </p>
      </div>
    </div>
  );
};
