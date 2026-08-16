import React from 'react';
import { StartNodeData } from '../../../types/workflow';
import { KeyValueEditor } from './KeyValueEditor';

interface StartConfigFormProps {
  data: StartNodeData;
  onChange: (partial: Partial<StartNodeData>) => void;
}

export const StartConfigForm: React.FC<StartConfigFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Node Label / Start Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">
          Start Title <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="e.g. Employee Onboarding Initiation"
          className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
        />
        <p className="text-[11px] text-slate-500">Defines the primary trigger title for this process.</p>
      </div>

      {/* Trigger Type */}
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
          <option value="form_submission">HR Form Submission</option>
          <option value="system_event">HRIS Webhook / System Event</option>
          <option value="schedule">Scheduled Cron / Periodic</option>
        </select>
      </div>

      {/* Metadata Key-Value Pairs */}
      <div className="pt-2 border-t border-slate-800">
        <KeyValueEditor
          label="Optional Metadata Attributes"
          items={data.metadata || []}
          onChange={(items) => onChange({ metadata: items })}
          keyPlaceholder="key (e.g. region)"
          valuePlaceholder="val (e.g. North America)"
          description="Contextual key-values injected into the workflow payload."
        />
      </div>
    </div>
  );
};
