import React from 'react';
import { TaskNodeData } from '../../../types/workflow';
import { KeyValueEditor } from './KeyValueEditor';

interface TaskConfigFormProps {
  data: TaskNodeData;
  onChange: (partial: Partial<TaskNodeData>) => void;
}

export const TaskConfigForm: React.FC<TaskConfigFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Title (Required) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Task Title <span className="text-rose-400">*</span>
          </label>
          {!data.label?.trim() && (
            <span className="text-[10px] text-rose-400 font-medium">Required field</span>
          )}
        </div>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="e.g. Verify Candidate Identification"
          className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition ${
            !data.label?.trim()
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          }`}
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Task Description</label>
        <textarea
          rows={3}
          value={data.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Provide instructions, expected deliverables, or compliance checklists..."
          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none resize-none transition"
        />
      </div>

      {/* Assignee & Priority */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Assignee</label>
          <input
            type="text"
            value={data.assignee || ''}
            onChange={(e) => onChange({ assignee: e.target.value })}
            placeholder="e.g. Sarah Jenkins (HRBP)"
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Priority</label>
          <select
            value={data.priority || 'medium'}
            onChange={(e) =>
              onChange({
                priority: e.target.value as TaskNodeData['priority'],
              })
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent SLA</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Due Date / SLA Duration</label>
        <input
          type="text"
          value={data.dueDate || ''}
          onChange={(e) => onChange({ dueDate: e.target.value })}
          placeholder="e.g. 3 Business Days or 2026-09-01"
          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
        />
      </div>

      {/* Custom Fields */}
      <div className="pt-2 border-t border-slate-800">
        <KeyValueEditor
          label="Custom Fields"
          items={data.customFields || []}
          onChange={(items) => onChange({ customFields: items })}
          keyPlaceholder="field name"
          valuePlaceholder="default value"
          description="Arbitrary form attributes attached to this human task."
        />
      </div>
    </div>
  );
};
