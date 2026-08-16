import React from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ValidationError, AppNode } from '../../types/workflow';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ValidationError[];
  warnings: ValidationError[];
  nodes: AppNode[];
  onSelectNode: (nodeId: string) => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  errors,
  warnings,
  nodes,
  onSelectNode,
}) => {
  if (!isOpen) return null;

  const isValid = errors.length === 0;

  const getNodeTitle = (nodeId?: string) => {
    if (!nodeId) return 'Global Graph Rule';
    const found = nodes.find((n) => n.id === nodeId);
    if (!found) return nodeId;
    const label = (found.data?.label as string) || found.type;
    return `${label} (${nodeId})`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isValid
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isValid ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Workflow Health & Validation Report</h2>
              <p className="text-xs text-slate-400">
                {isValid
                  ? 'All topological and schema checks passed'
                  : `${errors.length} error(s) and ${warnings.length} warning(s) found`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Status Summary Banner */}
          {isValid ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-300">Ready for Execution</h4>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">
                  The workflow structure is topologically sound with valid start, termination, and node schemas.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-rose-300">Issues Requiring Attention</h4>
                <p className="text-[11px] text-rose-400/80 mt-0.5">
                  Please resolve the following errors before running a production deployment.
                </p>
              </div>
            </div>
          )}

          {/* Errors List */}
          {errors.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                Critical Errors ({errors.length})
              </span>
              <div className="space-y-1.5">
                {errors.map((err, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950 border border-rose-900/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-200">{err.message}</span>
                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                          Target: {getNodeTitle(err.nodeId)}
                        </span>
                      </div>
                    </div>

                    {err.nodeId && (
                      <button
                        onClick={() => {
                          onSelectNode(err.nodeId!);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 px-2.5 py-1 rounded-md transition flex-shrink-0"
                      >
                        <span>Focus</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings List */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Topology Warnings ({warnings.length})
              </span>
              <div className="space-y-1.5">
                {warnings.map((warn, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950 border border-amber-900/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-200">{warn.message}</span>
                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                          Target: {getNodeTitle(warn.nodeId)}
                        </span>
                      </div>
                    </div>

                    {warn.nodeId && (
                      <button
                        onClick={() => {
                          onSelectNode(warn.nodeId!);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-md transition flex-shrink-0"
                      >
                        <span>Focus</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
