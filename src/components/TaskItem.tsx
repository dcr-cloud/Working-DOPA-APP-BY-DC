/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Circle, CheckCircle2, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onClick: (task: Task) => void;
  key?: string;
}

export const TaskItem = ({ task, onToggle, onClick }: TaskItemProps) => {
  const [showParticles, setShowParticles] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }
    onToggle(task.id);
  };

  return (
    <div
      onClick={() => onClick(task)}
      className="flex items-center gap-3 group cursor-pointer relative"
    >
      <div className="relative">
        <button
          onClick={handleToggle}
          className="relative z-10 p-1 -m-1"
        >
          {task.completed ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.2, 1],
                opacity: 1 
              }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="text-success"
            >
              <CheckCircle2 size={20} />
            </motion.div>
          ) : (
            <Circle className="text-text-muted group-hover:text-primary transition-colors" size={20} />
          )}
        </button>
        
        {/* Particles */}
        <AnimatePresence>
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 60,
                    y: (Math.random() - 0.5) * 60,
                    scale: 0,
                    opacity: 0
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute w-1.5 h-1.5 bg-success rounded-full"
                  style={{ left: '50%', top: '50%' }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col min-w-0">
        <span className={cn(
          'text-sm font-medium transition-all truncate',
          task.completed ? 'text-text-muted line-through' : 'text-text-primary'
        )}>
          {task.title}
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-text-muted">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {task.recurrence && task.recurrence !== 'None' && (
            <span className="flex items-center gap-1 text-accent">
              <Repeat size={10} />
              {task.recurrence}
            </span>
          )}
        </div>
      </div>

      {task.priority === 'High' && (
        <div className="w-1.5 h-1.5 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)] flex-shrink-0" />
      )}
    </div>
  );
};
