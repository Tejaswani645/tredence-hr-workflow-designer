import React from 'react';
import { StartNodeData } from '../../../types/workflow';
import { KeyValueEditor } from './KeyValueEditor';
import { AlertCircle, CheckCircle2, PlayCircle } from 'lucide-react';

interface StartNodeFormProps {
  data: StartNodeData;
  onChange: (partial: Partial<StartNodeData>) => void;
}

export const StartNodeForm: React.FC<StartNodeFormProps> = ({ data, onChange }) => {
  const isTitleValid = Boolean(data.label && data.label.trim().length > 0);

  return (
    <div className="space-y-4">
      {/* Node Title / Label */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Start Title <span className="text-rose-400">*</span>
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
          placeholder="e.g. New Employee Onboarding Kickoff"
          className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition ${
            !isTitleValid
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
          }`}
        />
        <p className="text-[11px] text-slate-500">
          The public title that identifies how and when this HR workflow starts.
        </p>
      </div>

      {/* Trigger Mechanism */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Trigger Mechanism</label>
        <select
          value={data.triggerType || 'manual'}
          onChange={(e) =>
            onChange({
              triggerType: e.target.value as StartNodeData['triggerType'],
            })
          }
          className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
        >
          <option value="manual">Manual Admin Launch</option>
          <option value="form_submission">HR Portal Form Submission</option>
          <option value="system_event">HRIS Webhook / System Event</option>
          <option value="schedule">Scheduled Cron / Periodic</option>
        </select>
      </div>

      {/* Dynamic Metadata List Builder */}
      <div className="pt-2 border-t border-slate-800">
        <KeyValueEditor
          label="Metadata Key-Value Pairs"
          items={data.metadata || []}
          onChange={(items) => onChange({ metadata: items })}
          keyPlaceholder="key (e.g. region)"
          valuePlaceholder="value (e.g. EMEA)"
          description="Injected metadata properties accessible to downstream tasks and automated actions."
        />
      </div>

      {/* Help Banner */}
      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-[11px] text-emerald-300/80 flex items-start gap-2">
        <PlayCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <span>Every workflow must have exactly one Start Node as the execution entry point.</span>
      </div>
    </div>
  );
};
