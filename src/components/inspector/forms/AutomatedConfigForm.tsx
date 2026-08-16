import React from 'react';
import { AutomatedNodeData, AutomationAction } from '../../../types/workflow';
import { Zap, Info } from 'lucide-react';

export const MOCK_AUTOMATION_ACTIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    description: 'Dispatches automated email notification using templated HTML.',
    params: ['to', 'subject', 'template', 'cc'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    description: 'Generates PDF contracts, NDAs, or offer letters dynamically.',
    params: ['template', 'recipient', 'format'],
  },
  {
    id: 'slack_notification',
    label: 'Slack Notification',
    description: 'Sends real-time message to public/private Slack channels.',
    params: ['channel', 'message', 'urgent'],
  },
  {
    id: 'provision_it_account',
    label: 'Provision IT Account',
    description: 'Creates corporate email, SSO accounts, and IT asset tickets.',
    params: ['user_email', 'role', 'laptop_model'],
  },
  {
    id: 'create_payroll_record',
    label: 'Create Payroll Record',
    description: 'Initializes employee record in Workday/Gusto payroll engine.',
    params: ['employee_id', 'salary_tier', 'currency'],
  },
  {
    id: 'schedule_calendar_event',
    label: 'Schedule Calendar Event',
    description: 'Books welcome orientation or 1-on-1 meetings in Google Calendar.',
    params: ['organizer', 'attendees', 'duration_mins'],
  },
];

interface AutomatedConfigFormProps {
  data: AutomatedNodeData;
  onChange: (partial: Partial<AutomatedNodeData>) => void;
  availableActions?: AutomationAction[];
}

export const AutomatedConfigForm: React.FC<AutomatedConfigFormProps> = ({
  data,
  onChange,
  availableActions = MOCK_AUTOMATION_ACTIONS,
}) => {
  const currentActionId = data.actionId || availableActions[0]?.id || 'send_email';
  const currentAction =
    availableActions.find((a) => a.id === currentActionId) || availableActions[0];

  const handleActionChange = (newActionId: string) => {
    const newAction = availableActions.find((a) => a.id === newActionId);
    const initialParams: Record<string, string> = {};
    if (newAction) {
      newAction.params.forEach((param) => {
        // Keep existing value if parameter name matches, otherwise default
        initialParams[param] = data.actionParams?.[param] || '';
      });
    }
    onChange({
      actionId: newActionId,
      actionParams: initialParams,
    });
  };

  const handleParamChange = (paramKey: string, value: string) => {
    onChange({
      actionParams: {
        ...(data.actionParams || {}),
        [paramKey]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">
          Step Title <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="e.g. Trigger Welcome Email"
          className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
        />
      </div>

      {/* Select Action from Mock API */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Automated API Action <span className="text-rose-400">*</span>
          </label>
          <span className="text-[10px] text-purple-400 font-mono flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" /> GET /automations
          </span>
        </div>
        <select
          value={currentActionId}
          onChange={(e) => handleActionChange(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
        >
          {availableActions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label} ({action.id})
            </option>
          ))}
        </select>
        {currentAction?.description && (
          <p className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1">
            <Info className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
            <span>{currentAction.description}</span>
          </p>
        )}
      </div>

      {/* Dynamic Parameters based on action definition */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Action Parameters Schema
          </label>
          <span className="text-[10px] font-mono text-slate-500">
            {currentAction?.params.length || 0} fields
          </span>
        </div>

        {currentAction?.params && currentAction.params.length > 0 ? (
          <div className="space-y-2.5">
            {currentAction.params.map((param) => {
              const val = data.actionParams?.[param] || '';
              return (
                <div key={param} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono font-medium text-purple-300">
                      {param}
                    </label>
                    <span className="text-[9px] text-slate-500 font-mono">string</span>
                  </div>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleParamChange(param, e.target.value)}
                    placeholder={`Enter value for ${param} (supports {{variable}} syntax)`}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 outline-none transition font-mono"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 text-center border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
            No parameters required for this action.
          </div>
        )}
      </div>

      {/* Retry Attempts */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">Auto-Retry on Timeout</label>
          <select
            value={data.retryAttempts ?? 3}
            onChange={(e) => onChange({ retryAttempts: Number(e.target.value) })}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 outline-none font-mono"
          >
            <option value={0}>0 retries</option>
            <option value={1}>1 retry</option>
            <option value={3}>3 retries</option>
            <option value={5}>5 retries</option>
          </select>
        </div>
      </div>
    </div>
  );
};
