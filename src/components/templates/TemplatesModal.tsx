import React, { useState } from 'react';
import { X, LayoutTemplate, Layers, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { WorkflowTemplate } from '../../types/workflow';
import { PRESET_HR_TEMPLATES } from '../../utils/templateWorkflows';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: WorkflowTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Onboarding', 'Leave & Absence', 'Verification'];

  const filteredTemplates = PRESET_HR_TEMPLATES.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-md">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Pre-Built HR Workflow Templates</h2>
              <p className="text-xs text-slate-400">
                Jumpstart your automation with industry standard HR workflows
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

        {/* Category Filters */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 flex flex-col justify-between transition duration-150 hover:shadow-lg group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/50">
                    {tpl.category}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {tpl.nodes.length} Nodes
                    </span>
                    <span>•</span>
                    <span>{tpl.edges.length} Edges</span>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-slate-100 group-hover:text-white transition">
                  {tpl.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Production Ready</span>
                </div>

                <button
                  onClick={() => {
                    onSelectTemplate(tpl);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
                >
                  <span>Load Preset</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Loading a template replaces the active canvas canvas.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
