/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, Clock, Tag, Plus, Circle, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Task, Priority } from '../types';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskEditModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onToggle: (id: string) => void;
}

export const TaskEditModal = ({ task, onClose, onUpdate, onToggle }: TaskEditModalProps) => {
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.description || '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [recurrence, setRecurrence] = useState(task.recurrence || 'None');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full max-w-2xl glass rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-heading">Edit Task</h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Task Title</label>
            <input 
              type="text" 
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                onUpdate(task.id, { title: e.target.value });
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Due Date</label>
              <div className="flex items-center gap-3 glass p-3 rounded-2xl text-sm">
                <Calendar size={18} className="text-primary" />
                <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date set'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Priority</label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as Priority[]).map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setPriority(p);
                      onUpdate(task.id, { priority: p });
                    }}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-xs font-bold transition-all border',
                      priority === p 
                        ? 'bg-primary/20 border-primary text-primary' 
                        : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Repeat</label>
              <div className="flex gap-2">
                {(['None', 'Daily', 'Weekdays', 'Weekly'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setRecurrence(r);
                      onUpdate(task.id, { recurrence: r });
                    }}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-[10px] font-bold transition-all border',
                      recurrence === r 
                        ? 'bg-accent/20 border-accent text-accent' 
                        : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Notes</label>
            <textarea 
              value={notes}
              onChange={e => {
                setNotes(e.target.value);
                onUpdate(task.id, { description: e.target.value });
              }}
              placeholder="Add some notes..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Subtasks</label>
              <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Add Subtask</button>
            </div>
            <div className="space-y-2">
              {task.subtasks.map(st => (
                <div key={st.id} className="flex items-center gap-3 glass p-3 rounded-xl">
                  <Circle size={16} className="text-text-muted" />
                  <span className="text-sm">{st.title}</span>
                </div>
              ))}
              {task.subtasks.length === 0 && (
                <p className="text-xs text-text-muted italic px-1">No subtasks yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex gap-4">
          <button
            onClick={() => {
              onToggle(task.id);
              onClose();
            }}
            className="flex-1 py-4 bg-success text-white rounded-2xl font-bold text-sm shadow-xl shadow-success/20 hover:scale-[1.02] transition-transform"
          >
            {task.completed ? 'Mark Incomplete' : 'Complete Task'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface AddTaskModalProps {
  onClose: () => void;
  onAdd: (data: Partial<Task>) => void;
  initialDate?: string;
  initialTime?: string;
}

export const AddTaskModal = ({ onClose, onAdd, initialDate, initialTime }: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate || format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(initialTime || '12:00');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [recurrence, setRecurrence] = useState<'None' | 'Daily' | 'Weekdays' | 'Weekly'>('None');
  const [notes, setNotes] = useState('');
  const [project, setProject] = useState('Personal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({
      title,
      dueDate: new Date(`${date}T${time}`).toISOString(),
      priority,
      recurrence,
      description: notes,
      projectFolder: project
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full max-w-2xl glass rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-heading">New Task</h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">What needs to be done?</label>
            <input 
              autoFocus
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Design Dopa UI..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Due Date & Time</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input 
                    type="date" 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="w-32 relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input 
                    type="time" 
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Priority</label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-xs font-bold transition-all border',
                      priority === p 
                        ? 'bg-primary/20 border-primary text-primary' 
                        : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Repeat</label>
              <div className="flex gap-2">
                {(['None', 'Daily', 'Weekdays', 'Weekly'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRecurrence(r)}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-[10px] font-bold transition-all border',
                      recurrence === r 
                        ? 'bg-accent/20 border-accent text-accent' 
                        : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Project Folder</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <select 
                  value={project}
                  onChange={e => setProject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Side Project">Side Project</option>
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted rotate-90" size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Notes (Optional)</label>
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add some details..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm min-h-[80px] resize-none"
            />
          </div>
        </form>

        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Save Task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
