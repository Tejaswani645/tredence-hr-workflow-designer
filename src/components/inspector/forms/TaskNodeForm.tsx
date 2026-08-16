import React from 'react';
import { TaskNodeData } from '../../../types/workflow';
import { KeyValueEditor } from './KeyValueEditor';
import { AlertCircle, CheckCircle2, User, Calendar, CheckSquare } from 'lucide-react';

interface TaskNodeFormProps {
  data: TaskNodeData;
  onChange: (partial: Partial<TaskNodeData>) => void;
}

export const TaskNodeForm: React.FC<TaskNodeFormProps> = ({ data, onChange }) => {
  const isTitleValid = Boolean(data.label && data.label.trim().length > 0);
  const isAssigneePresent = Boolean(data.assignee && data.assignee.trim().length > 0);

  return (
    <div className="space-y-4">
      {/* Title (Required) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Task Title <span className="text-rose-400">*</span>
          </label>
          {isTitleValid ? (
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Valid
            </span>
          ) : (
            <span className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Title is required
            </span>
          )}
        </div>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="e.g. Verify Candidate Identification"
          className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition ${
            !isTitleValid
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          }`}
        />
      </div>

      {/* Description Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Task Description</label>
        <textarea
          rows={3}
          value={data.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Provide step-by-step instructions or compliance requirements for the assignee..."
          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none resize-none transition"
        />
      </div>

      {/* Assignee & Priority */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Assignee</label>
            {!isAssigneePresent && (
              <span className="text-[9px] text-amber-400">Optional</span>
            )}
          </div>
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={data.assignee || ''}
              onChange={(e) => onChange({ assignee: e.target.value })}
              placeholder="e.g. Alex Rivera"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 outline-none transition"
            />
          </div>
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
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none transition"
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
        <label className="text-xs font-semibold text-slate-300">Due Date / SLA Target</label>
        <div className="relative">
          <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={data.dueDate || ''}
            onChange={(e) => onChange({ dueDate: e.target.value })}
            placeholder="e.g. 3 Business Days or 2026-09-01"
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 outline-none transition"
          />
        </div>
      </div>

      {/* Dynamic Key-Value Custom Fields */}
      <div className="pt-2 border-t border-slate-800">
        <KeyValueEditor
          label="Custom Form Fields"
          items={data.customFields || []}
          onChange={(items) => onChange({ customFields: items })}
          keyPlaceholder="field name"
          valuePlaceholder="default value"
          description="Custom dynamic fields to be filled by the assignee during task execution."
        />
      </div>

      {/* Status Notice */}
      <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-800/30 text-[11px] text-blue-300/80 flex items-start gap-2">
        <CheckSquare className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <span>Tasks represent actionable human items dispatched to assignees.</span>
      </div>
    </div>
  );
};
