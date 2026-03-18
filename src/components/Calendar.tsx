/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, addMonths, isSameMonth } from 'date-fns';
import { Task } from '../types';
import { TaskEditModal, AddTaskModal } from './TaskModals';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarProps {
  tasks: Task[];
  onPlanMyDay: () => void;
  onAddTask: (task: Partial<Task>) => void;
}

export const Calendar = ({ tasks, onPlanMyDay, onAddTask }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [initialTaskData, setInitialTaskData] = useState<Partial<Task>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const currentHour = new Date().getHours();

  useEffect(() => {
    if (view === 'week' && scrollContainerRef.current) {
      const scrollAmount = currentHour * 80 - 100; // 80px per hour, offset by 100px
      scrollContainerRef.current.scrollTo({ top: scrollAmount, behavior: 'smooth' });
    }
  }, [view, currentHour]);

  const handleSlotClick = (day: Date, hour: number) => {
    setInitialTaskData({
      dueDate: new Date(day.setHours(hour, 0, 0, 0)).toISOString()
    });
    setIsAddingTask(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-heading tracking-tight">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(view === 'week' ? addDays(currentDate, -7) : addMonths(currentDate, -1))}
                className="p-2 glass rounded-xl hover:text-primary transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 glass rounded-xl font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(view === 'week' ? addDays(currentDate, 7) : addMonths(currentDate, 1))}
                className="p-2 glass rounded-xl hover:text-primary transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 glass p-1 rounded-2xl">
            {(['week', 'month'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all',
                  view === v ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onPlanMyDay}
          className="flex items-center gap-3 bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-3xl font-bold text-sm shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles size={20} />
          Plan My Day (AI)
        </button>
      </header>

      {view === 'week' ? (
        <div className="card p-0 overflow-hidden border-white/5">
          <div className="grid grid-cols-8 border-b border-white/5">
            <div className="p-4 border-r border-white/5 flex items-center justify-center">
              <Clock size={16} className="text-text-muted" />
            </div>
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className={cn(
                  'p-4 text-center space-y-1 border-r border-white/5 last:border-r-0',
                  isSameDay(day, new Date()) && 'bg-primary/5'
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  {format(day, 'EEE')}
                </span>
                <p className={cn(
                  'text-xl font-mono font-bold',
                  isSameDay(day, new Date()) && 'text-primary'
                )}>
                  {format(day, 'd')}
                </p>
              </div>
            ))}
          </div>

          <div ref={scrollContainerRef} className="h-[600px] overflow-y-auto relative scrollbar-hide">
            <div className="grid grid-cols-8">
              {/* Time Column */}
              <div className="col-span-1 border-r border-white/5">
                {hours.map((hour) => (
                  <div 
                    key={hour} 
                    className={cn(
                      "h-20 p-2 text-[10px] font-mono font-bold text-text-muted text-right border-b border-white/5 transition-colors",
                      hour === currentHour && "text-primary bg-primary/5"
                    )}
                  >
                    {format(new Date().setHours(hour, 0), 'h a')}
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              {weekDays.map((day) => (
                <div key={day.toString()} className="col-span-1 border-r border-white/5 last:border-r-0 relative">
                  {hours.map((hour) => (
                    <div 
                      key={hour} 
                      onClick={() => handleSlotClick(day, hour)}
                      className={cn(
                        "h-20 border-b border-white/5 group relative cursor-pointer hover:bg-white/[0.02] transition-colors",
                        hour === currentHour && isSameDay(day, new Date()) && "border-l-2 border-l-primary bg-primary/5"
                      )}
                    >
                      <button className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-primary transition-opacity">
                        <Plus size={20} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Tasks Overlay */}
                  {tasks
                    .filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day))
                    .map(task => {
                      const date = new Date(task.dueDate!);
                      const top = date.getHours() * 80 + (date.getMinutes() / 60) * 80;
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{ top: `${top}px` }}
                          className={cn(
                            'absolute left-1 right-1 p-2 rounded-xl text-[10px] font-bold shadow-lg border border-white/10 overflow-hidden truncate z-10',
                            task.priority === 'High' ? 'bg-danger/20 text-danger border-danger/30' :
                            task.priority === 'Medium' ? 'bg-accent/20 text-accent border-accent/30' :
                            'bg-success/20 text-success border-success/30',
                            task.completed && 'opacity-50 grayscale'
                          )}
                        >
                          {task.title}
                        </motion.div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-6 border-white/5">
          <div className="grid grid-cols-7 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="bg-background/40 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
                {d}
              </div>
            ))}
            {monthDays.map((day, i) => {
              const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[120px] bg-background/20 p-3 space-y-2 transition-colors hover:bg-white/[0.02]",
                    !isSameMonth(day, currentDate) && "opacity-20",
                    isSameDay(day, new Date()) && "bg-primary/5"
                  )}
                >
                  <p className={cn(
                    "text-sm font-mono font-bold",
                    isSameDay(day, new Date()) && "text-primary"
                  )}>
                    {format(day, 'd')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {dayTasks.map(task => (
                      <div 
                        key={task.id}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          task.priority === 'High' ? 'bg-danger' :
                          task.priority === 'Medium' ? 'bg-accent' :
                          'bg-success',
                          task.completed && 'opacity-30'
                        )}
                        title={task.title}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isAddingTask && (
          <AddTaskModal 
            onClose={() => setIsAddingTask(false)} 
            onAdd={onAddTask}
            initialDate={initialTaskData.dueDate ? format(new Date(initialTaskData.dueDate), 'yyyy-MM-dd') : undefined}
            initialTime={initialTaskData.dueDate ? format(new Date(initialTaskData.dueDate), 'HH:mm') : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
