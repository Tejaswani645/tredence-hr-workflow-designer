import React from 'react';
import { EndNodeData } from '../../../types/workflow';
import { FileText, Check } from 'lucide-react';

interface EndConfigFormProps {
  data: EndNodeData;
  onChange: (partial: Partial<EndNodeData>) => void;
}

export const EndConfigForm: React.FC<EndConfigFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Node Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">
          End Step Title <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="e.g. Employee Successfully Onboarded"
          className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
        />
      </div>

      {/* End Message */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Completion Message</label>
        <textarea
          rows={3}
          value={data.endMessage || ''}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="Workflow finished. All assets distributed and accounts created."
          className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none resize-none transition"
        />
      </div>

      {/* Summary Flag Toggle */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="space-y-0.5 pr-3">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-semibold text-slate-200">
                Generate Summary Report
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Compile full execution audit logs and PDF digest upon workflow completion.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={data.summaryFlag}
            onClick={() => onChange({ summaryFlag: !data.summaryFlag })}
            className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
              data.summaryFlag ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center">
              {data.summaryFlag && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
