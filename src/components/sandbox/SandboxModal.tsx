import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Terminal,
  Activity,
  Sliders,
  Send,
  Zap,
} from 'lucide-react';
import { AppNode, AppEdge, SimulationResult, SimulationStep, ValidationError } from '../../types/workflow';
import { simulateWorkflow } from '../../services/api';
import confetti from 'canvas-confetti';

interface SandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: AppNode[];
  edges: AppEdge[];
  workflowTitle: string;
  validationErrors: ValidationError[];
  onHighlightNode?: (nodeId: string | null) => void;
  onHighlightEdges?: (edgeIds: string[]) => void;
}

export const SandboxModal: React.FC<SandboxModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  workflowTitle,
  validationErrors,
  onHighlightNode,
  onHighlightEdges,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'logs' | 'variables' | 'json'>('timeline');
  const [isLoading, setIsLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [copied, setCopied] = useState(false);

  // Simulation custom input variables
  const [customInputs, setCustomInputs] = useState({
    candidateName: 'Jordan Hayes',
    employeeId: 'EMP-2094',
    department: 'Engineering & Product',
    role: 'Senior Software Engineer',
    leaveDays: 3,
  });

  const isValid = validationErrors.filter((e) => e.severity === 'error').length === 0;

  // Run simulation against mock API
  const handleRunSimulation = async () => {
    setIsLoading(true);
    setCurrentStepIdx(-1);
    try {
      const result = await simulateWorkflow({
        title: workflowTitle,
        nodes,
        edges,
        initialInputs: customInputs,
      });
      setSimulationResult(result);
      if (result.steps.length > 0) {
        setCurrentStepIdx(0);
        // Highlight start node
        onHighlightNode?.(result.steps[0].nodeId);
        onHighlightEdges?.([]);
      }
      // Confetti celebration if workflow completes
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore in non-canvas environments
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial simulation on open if valid
  useEffect(() => {
    if (isOpen && isValid && !simulationResult) {
      handleRunSimulation();
    }
    if (!isOpen) {
      onHighlightNode?.(null);
      onHighlightEdges?.([]);
    }
  }, [isOpen]);

  // Synchronize canvas highlights with current step
  const handleStepSelect = (stepIdx: number) => {
    if (!simulationResult) return;
    setCurrentStepIdx(stepIdx);
    const targetStep = simulationResult.steps[stepIdx];
    if (targetStep) {
      onHighlightNode?.(targetStep.nodeId);
      // Collect all traversed edges up to this step
      const traversedEdges: string[] = [];
      for (let i = 0; i < stepIdx; i++) {
        const fromNode = simulationResult.steps[i].nodeId;
        const toNode = simulationResult.steps[i + 1]?.nodeId;
        const matchingEdge = edges.find((e) => e.source === fromNode && e.target === toNode);
        if (matchingEdge) traversedEdges.push(matchingEdge.id);
      }
      onHighlightEdges?.(traversedEdges);
    }
  };

  const handleNextStep = () => {
    if (!simulationResult) return;
    if (currentStepIdx < simulationResult.steps.length - 1) {
      handleStepSelect(currentStepIdx + 1);
    }
  };

  const handlePrevStep = () => {
    if (!simulationResult) return;
    if (currentStepIdx > 0) {
      handleStepSelect(currentStepIdx - 1);
    }
  };

  const handleCopyJSON = () => {
    const serialized = JSON.stringify({ title: workflowTitle, nodes, edges }, null, 2);
    navigator.clipboard.writeText(serialized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-4 px-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100">Workflow Sandbox & Simulation</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  POST /simulate
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive mock execution engine with real-time trace telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunSimulation}
              disabled={isLoading || !isValid}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-md transition"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Re-Run Simulation</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Validation Pass/Fail Banner */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            {isValid ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Graph Pre-Flight Passed (Topologically Sound)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-rose-400 font-semibold">
                <AlertCircle className="w-4 h-4" /> Graph has validation errors. Fix topology before executing.
              </span>
            )}
          </div>

          {simulationResult && (
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" />
                {simulationResult.totalDurationMs}ms total SLA
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">
                {simulationResult.steps.length} Steps Executed
              </span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/50 px-6">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'timeline'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Execution Timeline</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Telemetry Logs</span>
          </button>
          <button
            onClick={() => setActiveTab('variables')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'variables'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Variables & Payload</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'json'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Serialized Graph JSON</span>
          </button>
        </div>

        {/* Tab Content Areas */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#090d16]">
          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Stepper Toolbar */}
              <div className="p-3 px-6 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStepIdx <= 0}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium text-slate-200 transition"
                  >
                    Previous Step
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!simulationResult || currentStepIdx >= simulationResult.steps.length - 1}
                    className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-medium text-white transition"
                  >
                    Next Step
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  Step {currentStepIdx + 1} of {simulationResult?.steps.length || 0}
                </span>
              </div>

              {/* Timeline Step Cards List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {simulationResult?.steps.map((step, idx) => {
                  const isSelected = idx === currentStepIdx;
                  return (
                    <div
                      key={step.stepIndex}
                      onClick={() => handleStepSelect(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xl'
                          : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                              isSelected
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {step.stepIndex}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-100">{step.nodeLabel}</h4>
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                                {step.status}
                              </span>
                              {step.decision && step.decision !== 'default' && (
                                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                                  Decision: {step.decision}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">
                              Node ID: {step.nodeId} • Type: {step.nodeType}
                            </span>
                          </div>
                        </div>

                        <div className="text-right text-[11px] font-mono text-slate-400">
                          <span>{step.timestamp}</span>
                          <span className="block text-[10px] text-slate-500">+{step.durationMs}ms</span>
                        </div>
                      </div>

                      {/* Log Message */}
                      <p className="text-xs text-slate-300 mt-2.5 pl-10 border-l-2 border-slate-800 leading-relaxed font-sans">
                        {step.logMessage}
                      </p>

                      {step.evaluatedCondition && (
                        <div className="mt-2 ml-10 p-2 rounded bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300 font-mono">
                          {step.evaluatedCondition}
                        </div>
                      )}
                    </div>
                  );
                })}

                {(!simulationResult || simulationResult.steps.length === 0) && !isLoading && (
                  <div className="p-12 text-center text-slate-500 text-xs">
                    Click "Re-Run Simulation" to execute the mock workflow graph.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TELEMETRY LOGS */}
          {activeTab === 'logs' && (
            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-slate-300 space-y-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-slate-500 text-[11px] pb-2 border-b border-slate-800">
                  --- MOCK RUNTIME EXECUTION TRACE ---
                </div>
                {simulationResult?.steps.map((s) => (
                  <div key={s.stepIndex} className="leading-relaxed">
                    <span className="text-slate-500">[{s.timestamp}]</span>{' '}
                    <span className="text-blue-400">[NODE:{s.nodeId}]</span>{' '}
                    <span className="text-emerald-400">[SUCCESS]</span> {s.logMessage}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VARIABLES & PAYLOAD */}
          {activeTab === 'variables' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200">Simulation Inputs</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400">Candidate Full Name</label>
                      <input
                        type="text"
                        value={customInputs.candidateName}
                        onChange={(e) =>
                          setCustomInputs({ ...customInputs, candidateName: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">Department</label>
                      <input
                        type="text"
                        value={customInputs.department}
                        onChange={(e) =>
                          setCustomInputs({ ...customInputs, department: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">Leave Days (Threshold test)</label>
                      <input
                        type="number"
                        value={customInputs.leaveDays}
                        onChange={(e) =>
                          setCustomInputs({ ...customInputs, leaveDays: Number(e.target.value) })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200">Resolved Context State</h4>
                  <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-60">
                    {JSON.stringify(simulationResult?.variables || customInputs, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RAW GRAPH JSON */}
          {activeTab === 'json' && (
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Serialized Workflow Graph Schema</span>
                <button
                  onClick={handleCopyJSON}
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-blue-300 overflow-auto">
                {JSON.stringify({ title: workflowTitle, nodes, edges }, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Clicking timeline steps illuminates executing nodes on the canvas</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
