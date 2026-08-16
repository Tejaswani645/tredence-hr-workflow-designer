import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { KeyValuePair } from '../../../types/workflow';

interface KeyValueEditorProps {
  label: string;
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  description?: string;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  label,
  items = [],
  onChange,
  keyPlaceholder = 'Key (e.g. dept)',
  valuePlaceholder = 'Value (e.g. Engineering)',
  description,
}) => {
  const handleAdd = () => {
    onChange([...items, { key: '', value: '' }]);
  };

  const handleUpdate = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">{label}</label>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-950/50 hover:bg-blue-900/50 border border-blue-800/60 rounded transition"
        >
          <Plus className="w-3 h-3" />
          <span>Add Item</span>
        </button>
      </div>

      {description && <p className="text-[11px] text-slate-500">{description}</p>}

      {items.length === 0 ? (
        <div className="p-3 text-center border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
          No key-value attributes defined.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <input
                type="text"
                value={item.key}
                onChange={(e) => handleUpdate(index, 'key', e.target.value)}
                placeholder={keyPlaceholder}
                className="w-1/2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded px-2 py-1.5 text-xs text-slate-200 placeholder-slate-600 outline-none font-mono transition"
              />
              <span className="text-slate-600 font-mono">:</span>
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleUpdate(index, 'value', e.target.value)}
                placeholder={valuePlaceholder}
                className="w-1/2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded px-2 py-1.5 text-xs text-slate-200 placeholder-slate-600 outline-none transition"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1.5 rounded hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition"
                title="Remove Item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
