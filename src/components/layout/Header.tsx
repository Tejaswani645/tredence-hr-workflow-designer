import React from 'react';
import {
  Play,
  Undo2,
  Redo2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Layers,
  Sparkles,
  LayoutTemplate,
  Trash2,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { ValidationError } from '../../types/workflow';

interface HeaderProps {
  workflowTitle: string;
  onTitleChange: (title: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onAutoLayout: (direction: 'LR' | 'TB') => void;
  onOpenTemplates: () => void;
  onOpenValidation: () => void;
  onOpenSimulation: () => void;
  onOpenExportImport: () => void;
  onClearCanvas: () => void;
  validationErrors: ValidationError[];
  isSimulating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  workflowTitle,
  onTitleChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAutoLayout,
  onOpenTemplates,
  onOpenValidation,
  onOpenSimulation,
  onOpenExportImport,
  onClearCanvas,
  validationErrors,
  isSimulating = false,
}) => {
  const errorCount = validationErrors.filter((e) => e.severity === 'error').length;
  const warningCount = validationErrors.filter((e) => e.severity === 'warning').length;
  const isValid = errorCount === 0;

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Left branding and workflow title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
            <Sparkles className="w-4 h-4 text-blue-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={workflowTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-100 hover:bg-slate-800/60 focus:bg-slate-800/90 focus:ring-1 focus:ring-blue-500 rounded px-2 py-0.5 outline-none transition-colors border border-transparent hover:border-slate-700"
                placeholder="Workflow Title..."
              />
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                v1.2 Draft
              </span>
            </div>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800 hidden md:block" />

        {/* Templates selector button */}
        <button
          onClick={onOpenTemplates}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
          title="Browse Pre-built HR Templates"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-blue-400" />
          <span>Templates</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Center Action Toolbar */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-800/60 border border-slate-700/80 rounded-lg p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent text-slate-300 hover:text-white transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <div className="h-3.5 w-px bg-slate-700" />
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent text-slate-300 hover:text-white transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Auto Layout Dropdown */}
        <div className="flex items-center bg-slate-800/60 border border-slate-700/80 rounded-lg p-0.5">
          <button
            onClick={() => onAutoLayout('LR')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Auto Layout Horizontal (Left-to-Right)"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Auto-Layout (LR)</span>
          </button>
          <button
            onClick={() => onAutoLayout('TB')}
            className="p-1 rounded text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition border-l border-slate-700"
            title="Auto Layout Vertical (Top-to-Bottom)"
          >
            TB
          </button>
        </div>

        {/* Validation Status Pill */}
        <button
          onClick={onOpenValidation}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
            isValid
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
              : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
          }`}
        >
          {isValid ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Valid Flow</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {errorCount > 0 ? `${errorCount} Errors` : `${warningCount} Warnings`}
              </span>
            </>
          )}
        </button>

        {/* Clear Canvas */}
        <button
          onClick={onClearCanvas}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-800 transition"
          title="Reset / Clear Canvas"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Export / Import Button */}
        <button
          onClick={onOpenExportImport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Export / Import</span>
        </button>

        {/* Run Simulation / Sandbox Button */}
        <button
          onClick={onOpenSimulation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition ${
            isSimulating
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20 animate-pulse'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isSimulating ? 'Simulating...' : 'Test Run'}</span>
        </button>
      </div>
    </header>
  );
};
