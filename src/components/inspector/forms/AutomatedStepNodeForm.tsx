import React, { useState, useEffect } from 'react';
import { AutomatedNodeData, AutomationAction } from '../../../types/workflow';
import { fetchAutomations, MOCK_AUTOMATIONS } from '../../../services/api';
import { Zap, Bot, Info, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface AutomatedStepNodeFormProps {
  data: AutomatedNodeData;
  onChange: (partial: Partial<AutomatedNodeData>) => void;
}

export const AutomatedStepNodeForm: React.FC<AutomatedStepNodeFormProps> = ({ data, onChange }) => {
  const [actions, setActions] = useState<AutomationAction[]>(MOCK_AUTOMATIONS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchAutomations()
      .then((res: AutomationAction[]) => {
        if (isMounted) {
          setActions(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const currentActionId = data.actionId || actions[0]?.id || 'send_email';
  const currentAction = actions.find((a) => a.id === currentActionId) || actions[0];

  const isTitleValid = Boolean(data.label && data.label.trim().length > 0);

  const handleActionChange = (newActionId: string) => {
    const selected = actions.find((a) => a.id === newActionId);
    const initialParams: Record<string, string> = {};
    if (selected) {
      selected.params.forEach((param) => {
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
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Step Title <span className="text-rose-400">*</span>
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
          placeholder="e.g. Send Welcome Email & Orientation Kit"
          className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition ${
            !isTitleValid
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
          }`}
        />
      </div>

      {/* Action Selection Dropdown */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Select Mock API Action <span className="text-rose-400">*</span>
          </label>
          <span className="text-[10px] text-purple-400 font-mono flex items-center gap-1">
            {isLoading ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : <Zap className="w-2.5 h-2.5" />}
            GET /automations
          </span>
        </div>
        <select
          value={currentActionId}
          onChange={(e) => handleActionChange(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none transition"
        >
          {actions.map((action) => (
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

      {/* Dynamic Parameters Form Fields */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Dynamic Action Parameters ({currentAction?.params.length || 0})
          </label>
          <span className="text-[10px] text-slate-500 font-mono">Schema-Driven</span>
        </div>

        {currentAction?.params && currentAction.params.length > 0 ? (
          <div className="space-y-2.5">
            {currentAction.params.map((param) => {
              const def = currentAction.paramDefinitions?.find((p) => p.name === param);
              const val = data.actionParams?.[param] || '';
              const isRequired = def?.required ?? true;
              const hasVal = Boolean(val.trim());

              return (
                <div key={param} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono font-medium text-purple-300 flex items-center gap-1">
                      <span>{param}</span>
                      {isRequired && <span className="text-rose-400 text-[10px]">*</span>}
                    </label>
                    {def?.type && (
                      <span className="text-[9px] text-slate-500 font-mono uppercase">
                        {def.type}
                      </span>
                    )}
                  </div>

                  {def?.options ? (
                    <select
                      value={val}
                      onChange={(e) => handleParamChange(param, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none transition"
                    >
                      <option value="">-- Select {param} --</option>
                      {def.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={def?.type === 'number' ? 'number' : 'text'}
                      value={val}
                      onChange={(e) => handleParamChange(param, e.target.value)}
                      placeholder={def?.placeholder || `Value for ${param} (or {{var}})`}
                      className={`w-full bg-slate-950 border rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none transition font-mono ${
                        isRequired && !hasVal
                          ? 'border-slate-800 focus:border-purple-500'
                          : 'border-slate-800 focus:border-purple-500'
                      }`}
                    />
                  )}
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

      {/* Retry & Timeout Config */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">Retry Attempts on Failure</label>
        <select
          value={data.retryAttempts ?? 3}
          onChange={(e) => onChange({ retryAttempts: Number(e.target.value) })}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-2.5 py-1 outline-none font-mono"
        >
          <option value={0}>0 retries</option>
          <option value={1}>1 retry</option>
          <option value={3}>3 retries</option>
          <option value={5}>5 retries</option>
        </select>
      </div>

      {/* Integration Notice */}
      <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-800/30 text-[11px] text-purple-300/80 flex items-start gap-2">
        <Bot className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <span>Automated steps execute synchronously in mock execution simulation without human delay.</span>
      </div>
    </div>
  );
};
