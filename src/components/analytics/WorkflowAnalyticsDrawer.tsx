import React from 'react';
import {
  BarChart3,
  Bot,
  CheckSquare,
  UserCheck,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { AppNode, AppEdge, ValidationError } from '../../types/workflow';

interface WorkflowAnalyticsDrawerProps {
  nodes: AppNode[];
  edges: AppEdge[];
  validationErrors: ValidationError[];
}

export const WorkflowAnalyticsDrawer: React.FC<WorkflowAnalyticsDrawerProps> = ({
  nodes,
  edges,
  validationErrors,
}) => {
  const startCount = nodes.filter((n) => n.type === 'start').length;
  const taskCount = nodes.filter((n) => n.type === 'task').length;
  const approvalCount = nodes.filter((n) => n.type === 'approval').length;
  const automatedCount = nodes.filter((n) => n.type === 'automated').length;
  const endCount = nodes.filter((n) => n.type === 'end').length;
  const totalSteps = nodes.length;

  // Automation Coverage Percentage (Automated Steps vs Total Action Steps)
  const actionSteps = taskCount + approvalCount + automatedCount;
  const automationCoverage =
    actionSteps > 0 ? Math.round((automatedCount / actionSteps) * 100) : 0;

  // Error counts
  const errorCount = validationErrors.filter((e) => e.severity === 'error').length;
  const warningCount = validationErrors.filter((e) => e.severity === 'warning').length;

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 text-slate-100 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Workflow Insights
            </h3>
            <span className="text-[10px] text-slate-400">Performance & Automation Metrics</span>
          </div>
        </div>
      </div>

      {/* Analytics Body */}
      <div className="p-4 space-y-4 flex-1">
        {/* Metric Card 1: Automation Coverage */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Automation Coverage</span>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              {automationCoverage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${automationCoverage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            {automatedCount} of {actionSteps} functional action steps automated via mock APIs.
          </p>
        </div>

        {/* Metric Card 2: Step Distribution Breakdown */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span>Node Distribution</span>
            <span className="text-slate-400 font-mono text-[11px]">{totalSteps} Total Nodes</span>
          </div>

          <div className="space-y-1.5">
            {/* Start Node */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Start Triggers</span>
              </div>
              <span className="font-mono font-semibold text-slate-300">{startCount}</span>
            </div>

            {/* Task Node */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Human Tasks</span>
              </div>
              <span className="font-mono font-semibold text-slate-300">{taskCount}</span>
            </div>

            {/* Approval Node */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Approval Gates</span>
              </div>
              <span className="font-mono font-semibold text-slate-300">{approvalCount}</span>
            </div>

            {/* Automated Step */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Automated API Steps</span>
              </div>
              <span className="font-mono font-semibold text-slate-300">{automatedCount}</span>
            </div>

            {/* End Node */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>End Terminations</span>
              </div>
              <span className="font-mono font-semibold text-slate-300">{endCount}</span>
            </div>
          </div>
        </div>

        {/* Metric Card 3: Topology & Health Rating */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span>Graph Health</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                errorCount === 0
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                  : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
              }`}
            >
              {errorCount === 0 ? '100% HEALTHY' : `${errorCount} ISSUES`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Connections</span>
              <span className="text-slate-200 font-bold">{edges.length} edges</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Warnings</span>
              <span className="text-amber-400 font-bold">{warningCount}</span>
            </div>
          </div>
        </div>

        {/* Metric Card 4: Flow Objectives */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-950/30 to-indigo-950/30 border border-blue-900/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Process Objectives</span>
          </div>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            <li>Minimize manual human touchpoints</li>
            <li>Enforce mandatory SLA thresholds</li>
            <li>Ensure full audit trail generation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
