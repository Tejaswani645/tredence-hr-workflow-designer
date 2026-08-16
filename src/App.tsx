import React from 'react';

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-900/50 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            HR
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">HR Workflow Designer</h1>
            <p className="text-xs text-slate-400">Enterprise Automation Engine</p>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Initializing Workflow Canvas...</p>
      </main>
    </div>
  );
}
