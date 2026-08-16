import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  Copy,
  Check,
  FileCode,
  AlertCircle,
  CheckCircle2,
  FileJson,
  Sparkles,
} from 'lucide-react';
import { AppNode, AppEdge } from '../../types/workflow';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: AppNode[];
  edges: AppEdge[];
  workflowTitle: string;
  onImportGraph: (nodes: AppNode[], edges: AppEdge[], title?: string) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  workflowTitle,
  onImportGraph,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const exportPayload = {
    title: workflowTitle,
    version: '1.2.0',
    exportDate: new Date().toISOString(),
    nodes,
    edges,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  // Handle Download File
  const handleDownloadFile = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_workflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Copy to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Validate and Import Graph Payload
  const processImportJSON = (rawText: string) => {
    setImportError(null);
    try {
      const parsed = JSON.parse(rawText);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON: Root must be an object.');
      }
      if (!Array.isArray(parsed.nodes)) {
        throw new Error('Invalid Schema: Payload is missing a valid "nodes" array.');
      }
      if (!Array.isArray(parsed.edges)) {
        throw new Error('Invalid Schema: Payload is missing a valid "edges" array.');
      }

      onImportGraph(parsed.nodes, parsed.edges, parsed.title || 'Imported HR Workflow');
      onClose();
    } catch (err: unknown) {
      setImportError((err as Error).message || 'Failed to parse JSON workflow file.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
      processImportJSON(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-md">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Workflow Schema Export & Import</h2>
              <p className="text-xs text-slate-400">
                Transfer, archive, or restore workflow graphs as serialized JSON definitions
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

        {/* Tab Headers */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'export'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Graph</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'import'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Graph</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col">
          {activeTab === 'export' ? (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold">
                  Graph Definition ({nodes.length} Nodes, {edges.length} Edges)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>

                  <button
                    onClick={handleDownloadFile}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .JSON</span>
                  </button>
                </div>
              </div>

              <pre className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-auto max-h-[300px]">
                {jsonString}
              </pre>
            </div>
          ) : (
            <div className="space-y-4 flex-1 flex flex-col">
              {/* File Upload Trigger */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-slate-800 hover:border-blue-500/80 rounded-xl bg-slate-950/60 hover:bg-slate-950 flex flex-col items-center justify-center gap-2 cursor-pointer transition"
              >
                <Upload className="w-6 h-6 text-blue-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Click to select or drag & drop `.json` workflow file
                </span>
                <span className="text-[11px] text-slate-500">
                  Accepts serialized React Flow JSON files
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Paste JSON Raw Text */}
              <div className="space-y-1.5 flex-1 flex flex-col">
                <label className="text-xs font-semibold text-slate-300">
                  Or Paste Raw JSON Below:
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='{"title": "My Workflow", "nodes": [...], "edges": [...]}'
                  className="w-full flex-1 p-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-xs font-mono text-slate-200 outline-none resize-none transition"
                />
              </div>

              {/* Error Alert */}
              {importError && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => processImportJSON(importJsonText)}
                  disabled={!importJsonText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-md transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Apply & Load JSON Graph</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Standardized JSON format enables backup, migration, and automation triggers.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
