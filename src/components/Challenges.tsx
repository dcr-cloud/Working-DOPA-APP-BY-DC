/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Coins, Zap, Users, Heart, CheckCircle2, Circle, Lock, Clock, X, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Challenge } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChallengesProps {
  challenges: Challenge[];
  onCompleteChallenge: (challengeId: string, bonusXp?: number, bonusTokens?: number) => void;
}

const ChallengeIcon = ({ type }: { type: Challenge['type'] }) => {
  switch (type) {
    case 'Habit': return <Heart className="text-success" size={24} />;
    case 'Productivity': return <Zap className="text-primary" size={24} />;
    case 'Micro': return <Trophy className="text-accent" size={24} />;
    case 'Social': return <Users className="text-blue-500" size={24} />;
  }
};

const TRIVIA_QUESTIONS = [
  {
    text: "Which productivity technique involves working in 25-minute intervals followed by a 5-minute break?",
    options: ["Eisenhower Matrix", "Pomodoro Technique", "Getting Things Done (GTD)", "Time Blocking"],
    correctIndex: 1
  },
  {
    text: "What is the 'Two-Minute Rule' in productivity?",
    options: ["Tasks should take 2 mins", "If it takes <2 mins, do it now", "Wait 2 mins before starting", "Review tasks every 2 mins"],
    correctIndex: 1
  },
  {
    text: "Which quadrant of the Eisenhower Matrix should you prioritize?",
    options: ["Urgent & Important", "Not Urgent & Important", "Urgent & Not Important", "Not Urgent & Not Important"],
    correctIndex: 0
  },
  {
    text: "What does 'Eat the Frog' mean in productivity?",
    options: ["Do the hardest task first", "Take a long lunch break", "Avoid difficult tasks", "Reward yourself with food"],
    correctIndex: 0
  },
  {
    text: "What is 'Time Blocking'?",
    options: ["Ignoring the clock", "Scheduling specific tasks in time slots", "Stopping work every hour", "Using a stopwatch for everything"],
    correctIndex: 1
  },
  {
    text: "What is the primary goal of the 'Getting Things Done' (GTD) method?",
    options: ["Working 80 hours a week", "Clearing your mind of all tasks", "Never taking breaks", "Multitasking efficiently"],
    correctIndex: 1
  },
  {
    text: "What is 'Deep Work'?",
    options: ["Working late at night", "Distraction-free, high-focus work", "Working in a group", "Researching topics deeply"],
    correctIndex: 1
  }
];

const TriviaModal = ({ onClose, onComplete }: { onClose: () => void; onComplete: (correct: boolean) => void }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questionIndex] = useState(() => Math.floor(Math.random() * TRIVIA_QUESTIONS.length));

  const question = TRIVIA_QUESTIONS[questionIndex];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    setTimeout(() => {
      onComplete(selectedOption === question.correctIndex);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md glass rounded-3xl overflow-hidden p-8 space-y-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            <Zap size={20} />
            <span className="font-heading text-sm uppercase tracking-widest">Quick brain check ⚡</span>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-heading leading-tight">{question.text}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(index)}
                className={cn(
                  "w-full p-4 rounded-2xl text-left font-medium transition-all border",
                  selectedOption === index 
                    ? "bg-primary/20 border-primary text-primary" 
                    : "bg-white/5 border-white/10 text-text-muted hover:border-white/20",
                  isSubmitted && index === question.correctIndex && "bg-success/20 border-success text-success",
                  isSubmitted && selectedOption === index && index !== question.correctIndex && "bg-danger/20 border-danger text-danger"
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isSubmitted && index === question.correctIndex && <Check size={18} />}
                  {isSubmitted && selectedOption === index && index !== question.correctIndex && <X size={18} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={selectedOption === null || isSubmitted}
          onClick={handleSubmit}
          className={cn(
            "w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2",
            selectedOption === null || isSubmitted
              ? "bg-white/5 text-text-muted cursor-not-allowed"
              : "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {isSubmitted ? (
            selectedOption === question.correctIndex ? "Correct! +20 tokens 🪙 +100 XP ⚡" : "Incorrect! +50 XP ⚡"
          ) : (
            "Submit Answer"
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

export const Challenges = ({ challenges, onCompleteChallenge }: ChallengesProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [showTrivia, setShowTrivia] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [triviaResults, setTriviaResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChallengeAction = (challenge: Challenge) => {
    if (challenge.completed) return;

    if (challenge.type === 'Micro') {
      setActiveChallengeId(challenge.id);
      setShowTrivia(true);
    } else if (challenge.type === 'Social') {
      if (navigator.share) {
        navigator.share({
          title: 'Join me on Dopa!',
          text: 'I\'m using Dopa to crush my goals and level up my productivity. Join me and let\'s stay accountable together! 🚀',
          url: window.location.origin,
        }).then(() => {
          onCompleteChallenge(challenge.id);
        }).catch(console.error);
      } else {
        onCompleteChallenge(challenge.id);
      }
    } else {
      onCompleteChallenge(challenge.id);
    }
  };

  const handleTriviaComplete = (correct: boolean) => {
    if (activeChallengeId) {
      setTriviaResults(prev => ({ ...prev, [activeChallengeId]: correct }));
      onCompleteChallenge(activeChallengeId, correct ? 100 : 50, correct ? 20 : 0);
      setShowTrivia(false);
      setActiveChallengeId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-heading tracking-tight">Daily Challenges</h2>
          <div className="flex items-center gap-2 text-text-muted font-medium">
            <Clock size={16} />
            <span>Resets in {timeLeft}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 glass px-6 py-3 rounded-2xl">
          <Coins className="text-accent" size={24} fill="currentColor" />
          <span className="text-xl font-mono font-bold">Stack those tokens 🪙</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            whileHover={{ y: -4 }}
            className={cn(
              'card p-6 flex flex-col gap-6 relative overflow-hidden transition-all border-white/5',
              challenge.completed && 'opacity-60 grayscale-[0.5]'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-white/5">
                <ChallengeIcon type={challenge.type} />
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 text-accent font-mono font-bold">
                  <Coins size={14} fill="currentColor" />
                  <span>+{challenge.tokens}</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary font-mono font-bold">
                  <Zap size={14} fill="currentColor" />
                  <span>+{challenge.xp} XP</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{challenge.type} Challenge</span>
              <h3 className="text-xl font-heading leading-tight">{challenge.title}</h3>
            </div>

            <button
              disabled={challenge.completed}
              onClick={() => handleChallengeAction(challenge)}
              className={cn(
                'w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2',
                challenge.completed
                  ? 'bg-success/10 text-success border border-success/20 cursor-default'
                  : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
              )}
            >
              {challenge.completed ? (
                <>
                  <CheckCircle2 size={18} />
                  {challenge.type === 'Micro' && triviaResults[challenge.id] === false ? "Good try! 💪" : "You crushed it 🔥"}
                </>
              ) : (
                'Start Challenge'
              )}
            </button>

            {challenge.completed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-2 right-2"
              >
                <CheckCircle2 className="text-success" size={32} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Weekly Boss Challenge Section */}
      <section className="card bg-gradient-to-br from-danger/20 via-primary/10 to-accent/10 border-danger/30 p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy size={120} />
        </div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-danger">
            <Lock size={20} />
            <span className="font-heading text-sm uppercase tracking-widest">Weekly Boss Challenge</span>
          </div>
          <h3 className="text-3xl font-heading tracking-tight">The Ultimate Grinder</h3>
          <p className="text-text-primary/80 max-w-md leading-relaxed">
            Complete 20 tasks this week to earn 200 tokens and a rare badge!
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Progress</p>
              <p className="text-sm font-bold">12 / 20 tasks</p>
            </div>
            <span className="text-lg font-heading text-danger">60%</span>
          </div>
          <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              className="h-full bg-gradient-to-r from-danger to-primary shadow-[0_0_12px_rgba(239,68,68,0.5)]" 
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
              <Coins className="text-accent" size={18} fill="currentColor" />
              <span className="font-mono font-bold">200 Tokens</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
              <Trophy className="text-primary" size={18} />
              <span className="font-mono font-bold">Rare Badge</span>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showTrivia && (
          <TriviaModal 
            onClose={() => setShowTrivia(false)} 
            onComplete={handleTriviaComplete} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
