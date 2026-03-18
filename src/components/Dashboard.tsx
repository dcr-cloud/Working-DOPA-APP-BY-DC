/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Flame, Coins, Trophy, Plus, CheckCircle2, Circle, X, Calendar, Clock, Tag, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Task, Challenge, Priority } from '../types';
import { format } from 'date-fns';
import { TaskItem } from './TaskItem';
import { TaskEditModal, AddTaskModal } from './TaskModals';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  user: UserProfile;
  tasks: Task[];
  challenges: Challenge[];
  todayFocusId: string | null;
  onAddTask: () => void;
  onGoToStore: () => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onAddTaskDirect: (taskData: Partial<Task>) => void;
  onPinTask: (taskId: string) => void;
}

export const Dashboard = ({ 
  user, 
  tasks, 
  challenges, 
  todayFocusId,
  onAddTask, 
  onGoToStore, 
  onToggleTask, 
  onUpdateTask,
  onAddTaskDirect,
  onPinTask
}: DashboardProps) => {
  const todayTasks = tasks.filter(t => !t.completed);
  const focusTask = tasks.find(t => t.id === todayFocusId);
  const completedChallengesCount = challenges.filter(c => c.completed).length;
  const nextLevelXP = 1000;

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const bossProgress = 12;
  const bossTarget = 20;
  const bossPercentage = (bossProgress / bossTarget) * 100;

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-heading tracking-tight">
            Good morning, {user.displayName} ☀️
          </h1>
          <p className="text-text-muted font-medium">
            {format(new Date(), 'EEEE, MMMM do')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToStore}
            className="glass px-4 py-2 rounded-2xl flex items-center gap-2 hover:bg-white/5 transition-colors"
          >
            <Coins className="text-accent" size={20} fill="currentColor" />
            <span className="font-mono font-bold">{user.tokens}</span>
          </button>
          <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2">
            <Flame className="text-accent" size={20} fill="currentColor" />
            <span className="font-mono font-bold">{user.streak} day streak</span>
          </div>
        </div>
      </header>

      {/* Today's Focus Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Tag className="text-primary" size={16} />
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted">Today's Focus</h2>
        </div>
        {focusTask ? (
          <motion.div 
            layoutId="focus-task"
            className={cn(
              "card bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30 p-6 flex items-center gap-4 relative overflow-hidden",
              focusTask.completed && "opacity-60"
            )}
          >
            <div className="absolute top-0 right-0 p-2">
              <Trophy className="text-primary/20" size={48} />
            </div>
            <TaskItem 
              task={focusTask} 
              onToggle={onToggleTask} 
              onClick={setSelectedTask} 
            />
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-primary">
              <span className="text-[10px] font-bold uppercase tracking-widest">+25 Bonus XP</span>
            </div>
          </motion.div>
        ) : (
          <div className="card border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
            <p className="text-sm text-text-muted italic">No focus task pinned. Tap a task to pin it! ⭐</p>
          </div>
        )}
      </section>

      {/* XP Progress Bar */}
      <section className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-primary" size={20} />
            <span className="font-heading text-sm uppercase tracking-wider">Level {user.level}</span>
          </div>
          <span className="font-mono text-sm font-bold">{user.xp} / {nextLevelXP} XP</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(user.xp / nextLevelXP) * 100}%` }}
            className="h-full bg-primary shadow-[0_0_12px_rgba(var(--primary-color-rgb),0.5)]"
          />
        </div>
      </section>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tasks Card */}
        <div className={cn(
          "card space-y-4 min-h-[200px] flex flex-col transition-all duration-500",
          todayTasks.length === 0 && tasks.length > 0 && "shadow-[0_0_20px_rgba(16,185,129,0.2)] border-success/30"
        )}>
          <div className="flex items-center justify-between">
            <h3 className={cn(
              "font-heading text-lg transition-colors",
              todayTasks.length === 0 && tasks.length > 0 ? "text-success" : "text-text-primary"
            )}>
              {todayTasks.length === 0 && tasks.length > 0 ? "All done today! 🎉" : "Tasks Due Today"}
            </h3>
            <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded-lg">{todayTasks.length} left</span>
          </div>
          <div className="space-y-3 flex-1">
            {todayTasks.length > 0 ? (
              todayTasks.slice(0, 4).map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={onToggleTask} 
                  onClick={setSelectedTask} 
                />
              ))
            ) : tasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Plus className="text-text-muted" size={24} />
                </div>
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Nothing here yet</p>
                <p className="text-xs text-text-muted">Legends start somewhere 👑</p>
                <button onClick={() => setIsAddingTask(true)} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline mt-2">Add your first task!</button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-4">
                <span className="text-3xl">🎉</span>
                <p className="text-sm font-bold text-success uppercase tracking-widest">All done!</p>
                <p className="text-xs text-text-muted">Legend energy 👑</p>
              </div>
            )}
          </div>
          {todayTasks.length > 4 && (
            <button onClick={onAddTask} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline pt-2">
              View {todayTasks.length - 4} more
            </button>
          )}
        </div>

        {/* Challenges Card */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg">Daily Challenges</h3>
            <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded-lg">{completedChallengesCount}/4 done</span>
          </div>
          <div className="space-y-3">
            {challenges.map(challenge => (
              <div key={challenge.id} className="flex items-center gap-3">
                {challenge.completed ? (
                  <CheckCircle2 className="text-success" size={18} />
                ) : (
                  <Circle className="text-text-muted" size={18} />
                )}
                <span className={cn(
                  'text-sm font-medium',
                  challenge.completed ? 'text-text-muted line-through' : 'text-text-primary'
                )}>
                  {challenge.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Boss Challenge Card */}
        <div className="card bg-gradient-to-br from-danger/10 to-primary/10 border-danger/20 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="text-danger" size={20} />
            <h3 className="font-heading text-lg">Boss Challenge</h3>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">
            Complete 20 tasks this week to earn 200 tokens and a rare badge!
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Progress</p>
                <p className="text-sm font-bold">{bossProgress} / {bossTarget} tasks</p>
              </div>
              <span className="text-lg font-heading text-danger">{Math.round(bossPercentage)}%</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bossPercentage}%` }}
                className={cn(
                  "h-full transition-all duration-1000",
                  bossPercentage >= 100 ? "bg-accent shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse" : "bg-danger"
                )}
              />
            </div>
          </div>
          <p className="text-[10px] text-text-muted italic">Ends in 3 days, 4 hours</p>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddingTask(true)}
        className="fixed bottom-24 left-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center z-40"
      >
        <Plus size={32} />
      </motion.button>

      {/* Modals */}
      <AnimatePresence>
        {selectedTask && (
          <TaskEditModal 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
            onUpdate={onUpdateTask}
            onToggle={onToggleTask}
          />
        )}
        {isAddingTask && (
          <AddTaskModal 
            onClose={() => setIsAddingTask(false)} 
            onAdd={onAddTaskDirect}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
