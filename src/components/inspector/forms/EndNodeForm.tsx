import React from 'react';
import { EndNodeData } from '../../../types/workflow';
import { FileCheck, Check, StopCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface EndNodeFormProps {
  data: EndNodeData;
  onChange: (partial: Partial<EndNodeData>) => void;
}

export const EndNodeForm: React.FC<EndNodeFormProps> = ({ data, onChange }) => {
  const isTitleValid = Boolean(data.label && data.label.trim().length > 0);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            End Node Title <span className="text-rose-400">*</span>
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
          placeholder="e.g. Employee Successfully Onboarded"
          className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition ${
            !isTitleValid
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
          }`}
        />
      </div>

      {/* Completion Message */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Completion Message / Status</label>
        <textarea
          rows={3}
          value={data.endMessage || ''}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="Onboarding completed. All credentials generated, payroll configured, and welcome kit dispatched."
          className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none resize-none transition"
        />
      </div>

      {/* Summary Flag Boolean Toggle */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="space-y-0.5 pr-3">
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-semibold text-slate-200">
                Summary Flag (Audit Report)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When enabled, a comprehensive trace digest and audit certificate are automatically generated at completion.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={data.summaryFlag}
            onClick={() => onChange({ summaryFlag: !data.summaryFlag })}
            className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 flex-shrink-0 ${
              data.summaryFlag ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center">
              {data.summaryFlag && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
            </div>
          </button>
        </div>
      </div>

      {/* Terminal Node Notice */}
      <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-800/30 text-[11px] text-rose-300/80 flex items-start gap-2">
        <StopCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
        <span>End nodes mark the valid termination of an execution path. No outgoing edges allowed.</span>
      </div>
    </div>
  );
};
