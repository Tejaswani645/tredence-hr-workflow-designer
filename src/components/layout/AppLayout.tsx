import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { NodeType, ValidationError } from '../../types/workflow';

interface AppLayoutProps {
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
  onAddNode: (type: NodeType) => void;
  children: React.ReactNode;
  inspectorPanel?: React.ReactNode;
  isInspectorOpen?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
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
  isSimulating,
  onAddNode,
  children,
  inspectorPanel,
  isInspectorOpen = false,
}) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        workflowTitle={workflowTitle}
        onTitleChange={onTitleChange}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        onAutoLayout={onAutoLayout}
        onOpenTemplates={onOpenTemplates}
        onOpenValidation={onOpenValidation}
        onOpenSimulation={onOpenSimulation}
        onOpenExportImport={onOpenExportImport}
        onClearCanvas={onClearCanvas}
        validationErrors={validationErrors}
        isSimulating={isSimulating}
      />

      {/* Main App Body */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Draggable Palette */}
        <Sidebar onAddNode={onAddNode} />

        {/* Center Canvas Area */}
        <main className="flex-1 relative h-full bg-[#090d16] overflow-hidden flex flex-col">
          {children}
        </main>

        {/* Right Inspector Drawer Overlay */}
        <div
          className={`h-full border-l border-slate-800 bg-slate-900/95 backdrop-blur-xl z-20 transition-all duration-300 ease-in-out shadow-2xl flex flex-col ${
            isInspectorOpen ? 'w-96 translate-x-0' : 'w-0 translate-x-full overflow-hidden border-none'
          }`}
        >
          {isInspectorOpen && inspectorPanel}
        </div>
      </div>
    </div>
  );
};
