/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Target, Bell, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OnboardingProps {
  onComplete: (data: { name: string; goals: string[]; firstChallengeClaimed: boolean }) => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [firstChallengeClaimed, setFirstChallengeClaimed] = useState(false);

  const goals = [
    { id: 'fitness', label: 'Fitness', icon: '💪' },
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'study', label: 'Study', icon: '📚' },
    { id: 'habits', label: 'Habits', icon: '🧠' },
    { id: 'side-projects', label: 'Side Project', icon: '🚀' },
    { id: 'mental-health', label: 'Mental Health', icon: '💆' },
  ];

  const toggleGoal = (id: string) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter(g => g !== id));
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  const nextStep = () => setStep(step + 1);

  const handleClaim = () => {
    setFirstChallengeClaimed(true);
    // Animation logic would go here, but for now we just move to next step
    setTimeout(() => nextStep(), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-24 h-24 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-primary/30"
            >
              <Sparkles className="text-white" size={48} />
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-5xl font-heading tracking-tight leading-tight">Dopa</h1>
              <p className="text-xl text-text-muted font-medium">Level up your life. One task at a time.</p>
            </div>
            
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">What's your name?</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-lg font-medium"
              />
            </div>

            <button
              onClick={nextStep}
              className="w-full py-5 bg-primary text-white rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Let's Go
              <ArrowRight size={24} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full space-y-10"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-4xl font-heading tracking-tight">You EARN premium here.</h2>
            </div>
            <div className="space-y-6">
              {[
                { icon: '🎯', text: 'Track your tasks & habits' },
                { icon: '🪙', text: 'Complete challenges, earn tokens' },
                { icon: '🏆', text: 'Spend tokens to unlock premium — free' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 glass p-5 rounded-2xl"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-bold text-lg">{item.text}</span>
                </motion.div>
              ))}
            </div>
            <button
              onClick={nextStep}
              className="w-full py-5 bg-primary text-white rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 transition-all"
            >
              Sounds good →
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full space-y-10"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-4xl font-heading tracking-tight">What are you working on?</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={cn(
                    'p-4 rounded-2xl border transition-all flex items-center gap-3',
                    selectedGoals.includes(goal.id)
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'
                  )}
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="font-bold text-sm">{goal.label}</span>
                </button>
              ))}
            </div>
            <button
              disabled={selectedGoals.length === 0}
              onClick={nextStep}
              className="w-full py-5 bg-primary text-white rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Set My Goals →
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md w-full space-y-10 relative"
          >
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-heading tracking-tight">Your first token is waiting.</h2>
            </div>
            
            <div className="card p-8 bg-gradient-to-br from-primary/20 to-accent/10 border-primary/20 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="p-4 rounded-2xl bg-white/5">
                  <Target className="text-primary" size={32} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 text-accent font-mono font-bold">
                    <span>🪙 +10 tokens</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary font-mono font-bold">
                    <span>⚡ +50 XP</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-heading leading-tight">Drink 8 glasses of water today</h3>
              </div>
              <button
                disabled={firstChallengeClaimed}
                onClick={handleClaim}
                className="w-full py-5 bg-primary text-white rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 relative z-10"
              >
                {firstChallengeClaimed ? 'Claimed! ✨' : 'Claim it →'}
              </button>

              {firstChallengeClaimed && (
                <motion.div
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: -400, opacity: 0 }}
                  transition={{ duration: 1, ease: "easeIn" }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl z-20"
                >
                  🪙
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full text-center space-y-10"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-3xl mx-auto flex items-center justify-center">
              <Bell className="text-accent" size={40} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-heading tracking-tight">Never miss your streak 🔥</h2>
              <p className="text-text-muted font-medium leading-relaxed">
                We'll remind you before your daily challenges reset
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => onComplete({ name, goals: selectedGoals, firstChallengeClaimed })}
                className="w-full py-5 bg-primary text-white rounded-3xl font-bold text-lg shadow-xl shadow-primary/30"
              >
                Turn on reminders
              </button>
              <button
                onClick={() => onComplete({ name, goals: selectedGoals, firstChallengeClaimed })}
                className="w-full py-5 bg-transparent text-text-muted rounded-3xl font-bold text-lg hover:text-text-primary transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
