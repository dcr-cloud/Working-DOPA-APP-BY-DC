/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle2, Circle, MoreVertical, Trash2, ChevronDown, ChevronUp, Tag, Filter, ArrowUpDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Task, Priority, UserProfile } from '../types';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { TaskItem } from './TaskItem';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TasksProps {
  user: UserProfile;
  tasks: Task[];
  todayFocusId: string | null;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Partial<Task>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onPinTask: (taskId: string) => void;
}

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    High: 'bg-danger/10 text-danger border-danger/20',
    Medium: 'bg-accent/10 text-accent border-accent/20',
    Low: 'bg-success/10 text-success border-success/20',
  };

  return (
    <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border', colors[priority])}>
      {priority}
    </span>
  );
};

export const Tasks = ({ user, tasks, todayFocusId, onToggleTask, onDeleteTask, onAddTask, onUpdateTask, onPinTask }: TasksProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'created'>('created');
  const [showCompleted, setShowCompleted] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Today' | 'This Week' | 'This Month'>('All');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === 'All') return true;
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      if (filter === 'Today') return isToday(dueDate);
      if (filter === 'This Week') return isThisWeek(dueDate);
      if (filter === 'This Month') return isThisMonth(dueDate);
      return true;
    });
  }, [tasks, filter]);

  const activeTasks = useMemo(() => filteredTasks.filter(t => !t.completed), [filteredTasks]);
  const completedTasks = useMemo(() => filteredTasks.filter(t => t.completed), [filteredTasks]);

  const sortedTasks = useMemo(() => {
    const list = [...activeTasks];
    if (sortBy === 'date') {
      list.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else if (sortBy === 'priority') {
      const weights = { High: 3, Medium: 2, Low: 1 };
      list.sort((a, b) => weights[b.priority] - weights[a.priority]);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [activeTasks, sortBy]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      title: newTaskTitle,
      priority: newTaskPriority,
    });
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const isLimitReached = !user.isPremium && activeTasks.length >= 10;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-0">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-heading tracking-tight">Task Manager</h2>
          <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
            {activeTasks.length} Active Tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="p-2 glass rounded-xl text-text-muted hover:text-text-primary transition-colors">
              <ArrowUpDown size={20} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 shadow-2xl">
              {(['created', 'date', 'priority'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={cn(
                    'w-full text-left px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors',
                    sortBy === s ? 'bg-primary text-white' : 'text-text-muted hover:bg-white/5'
                  )}
                >
                  Sort by {s}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {(['All', 'Today', 'This Week', 'This Month'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border',
              filter === f 
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Limit Banner */}
      {isLimitReached && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="text-primary" size={20} />
            <p className="text-sm font-bold">Unlock unlimited tasks in the Token Store 🪙</p>
          </div>
          <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">
            Upgrade
          </button>
        </motion.div>
      )}

      {/* Add Task Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddTask}
            className="card space-y-4 overflow-hidden"
          >
            <input
              autoFocus
              type="text"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(['High', 'Medium', 'Low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewTaskPriority(p)}
                    className={cn(
                      'text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border transition-all',
                      newTaskPriority === p
                        ? p === 'High' ? 'bg-danger text-white border-danger' : p === 'Medium' ? 'bg-accent text-white border-accent' : 'bg-success text-white border-success'
                        : 'bg-white/5 text-text-muted border-white/10 hover:border-white/20'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-sm font-medium text-text-muted hover:text-text-primary px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20"
                >
                  Add Task
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <SwipeableTaskRow 
            key={task.id} 
            task={task} 
            isPinned={task.id === todayFocusId}
            onToggle={onToggleTask} 
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
            onPin={onPinTask}
          />
        ))}

        {activeTasks.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
              <CheckCircle2 size={48} className="text-text-muted" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-heading">Nothing here yet.</h3>
              <p className="text-text-muted font-medium">Legends start somewhere 👑 Add your first task!</p>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              Add Task +
            </button>
          </div>
        )}
      </div>

      {/* Completed Section */}
      {completedTasks.length > 0 && (
        <div className="space-y-4 pt-6">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest hover:text-text-primary transition-colors"
          >
            {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Completed ({completedTasks.length})
          </button>
          
          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {completedTasks.map(task => (
                  <div key={task.id} className="card p-4 flex items-center gap-4 opacity-60 grayscale-[0.5]">
                    <button onClick={() => onToggleTask(task.id)} className="text-success">
                      <CheckCircle2 size={24} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium line-through truncate">{task.title}</h3>
                      <p className="text-[10px] text-text-muted">Done on {format(new Date(), 'MMM d')}</p>
                    </div>
                    <button onClick={() => onDeleteTask(task.id)} className="p-2 text-text-muted hover:text-danger transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const SwipeableTaskRow = ({ task, isPinned, onToggle, onDelete, onUpdate, onPin }: { 
  task: Task; 
  isPinned: boolean;
  onToggle: (id: string) => void; 
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onPin: (id: string) => void;
  key?: string;
}) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
  const background = useTransform(x, [-100, 0, 100], ['#EF4444', 'transparent', '#10B981']);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -80) {
      onDelete(task.id);
    } else if (info.offset.x > 80) {
      onToggle(task.id);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <motion.div style={{ background }} className="absolute inset-0 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
          <CheckCircle2 size={20} />
          Complete
        </div>
        <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
          Delete
          <Trash2 size={20} />
        </div>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, opacity }}
        onDragEnd={handleDragEnd}
        className="relative z-10 card p-0 border-white/5 active:cursor-grabbing"
      >
        <div className="p-4 flex items-center gap-4">
          <TaskItem 
            task={task} 
            onToggle={onToggle} 
            onClick={() => {}} // Could open modal here too
          />
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPin(task.id)}
              className={cn(
                "p-2 rounded-xl transition-all",
                isPinned ? "bg-primary/20 text-primary" : "text-text-muted hover:text-text-primary hover:bg-white/5"
              )}
            >
              <Tag size={18} fill={isPinned ? "currentColor" : "none"} />
            </button>
            <PriorityBadge priority={task.priority} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
