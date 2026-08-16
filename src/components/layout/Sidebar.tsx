import React, { useState } from 'react';
import {
  PlayCircle,
  CheckSquare,
  UserCheck,
  Bot,
  StopCircle,
  Plus,
  GripVertical,
  Search,
  Sparkles,
  Info,
} from 'lucide-react';
import { NodeType } from '../../types/workflow';

interface NodeTemplateItem {
  type: NodeType;
  title: string;
  category: string;
  description: string;
  accentColor: string;
  glowColor: string;
  icon: React.ElementType;
  badge: string;
}

const NODE_TEMPLATES: NodeTemplateItem[] = [
  {
    type: 'start',
    title: 'Start Node',
    category: 'Trigger',
    description: 'Entry point of the workflow with metadata & trigger triggers.',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    icon: PlayCircle,
    badge: 'Green',
  },
  {
    type: 'task',
    title: 'Task Node',
    category: 'Human Action',
    description: 'Assigns tasks to team members with due date and custom fields.',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    icon: CheckSquare,
    badge: 'Blue',
  },
  {
    type: 'approval',
    title: 'Approval Node',
    category: 'Governance',
    description: 'Decision step for Manager, HRBP, or Director with auto-approve.',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    icon: UserCheck,
    badge: 'Amber',
  },
  {
    type: 'automated',
    title: 'Automated Step',
    category: 'System Integration',
    description: 'Triggers mock API automations like Send Email, DocGen, Slack.',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.15)',
    icon: Bot,
    badge: 'Purple',
  },
  {
    type: 'end',
    title: 'End Node',
    category: 'Termination',
    description: 'Terminates the workflow and triggers optional summary reports.',
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.15)',
    icon: StopCircle,
    badge: 'Red',
  },
];

interface SidebarProps {
  onAddNode: (type: NodeType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddNode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = NODE_TEMPLATES.filter(
    (node) =>
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full z-20 select-none shadow-xl">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Node Palette
            </span>
          </div>
          <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
            5 Types
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Draggable Node Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="text-[11px] font-semibold text-slate-400 px-1 flex items-center justify-between">
          <span>DRAG OR CLICK TO ADD</span>
          <Info className="w-3 h-3 text-slate-500" />
        </div>

        {filteredNodes.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              onClick={() => onAddNode(item.type)}
              className="group relative bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 cursor-grab active:cursor-grabbing transition duration-150 shadow-sm hover:shadow-md"
              style={{
                boxShadow: `inset 3px 0 0 ${item.accentColor}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: item.glowColor,
                      color: item.accentColor,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-semibold text-slate-100 group-hover:text-white transition">
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddNode(item.type);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    title="Add to canvas center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 cursor-grab" />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>
          );
        })}

        {filteredNodes.length === 0 && (
          <div className="p-6 text-center text-slate-500 text-xs">
            No matching node types found.
          </div>
        )}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span>Connect handles to create conditional HR logic paths.</span>
      </div>
    </aside>
  );
};
