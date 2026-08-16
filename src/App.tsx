import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { NodeType, ValidationError } from './types/workflow';

export default function App() {
  const [workflowTitle, setWorkflowTitle] = useState('Employee Onboarding Workflow');
  const [validationErrors] = useState<ValidationError[]>([]);

  return (
    <AppLayout
      workflowTitle={workflowTitle}
      onTitleChange={setWorkflowTitle}
      canUndo={false}
      canRedo={false}
      onUndo={() => {}}
      onRedo={() => {}}
      onAutoLayout={() => {}}
      onOpenTemplates={() => {}}
      onOpenValidation={() => {}}
      onOpenSimulation={() => {}}
      onOpenExportImport={() => {}}
      onClearCanvas={() => {}}
      validationErrors={validationErrors}
      onAddNode={(type: NodeType) => {
        console.log('Add node:', type);
      }}
      isInspectorOpen={false}
    >
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Canvas Workspace Ready
      </div>
    </AppLayout>
  );
}
