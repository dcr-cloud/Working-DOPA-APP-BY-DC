/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Tasks } from './components/Tasks';
import { Calendar } from './components/Calendar';
import { Challenges } from './components/Challenges';
import { Profile } from './components/Profile';
import { Store } from './components/Store';
import { Onboarding } from './components/Onboarding';
import { Chat } from './components/Chat';
import { UserProfile, Task, Challenge, StoreItem } from './types';
import { AnimatePresence, motion } from 'motion/react';

// Mock Data for Initial UI Development
const MOCK_USER: UserProfile = {
  uid: '123',
  displayName: 'Champion',
  tokens: 0,
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  streakFreezeCount: 0,
  isPremium: false,
  badges: ['rookie'],
  unlockedThemes: [],
  activeTheme: 'default',
};

const MOCK_TASKS: Task[] = [];

const MOCK_CHALLENGES: Challenge[] = [
  { id: 'c1', type: 'Habit', title: 'Drink 8 glasses of water', tokens: 10, xp: 50, completed: true, expiresAt: '' },
  { id: 'c2', type: 'Productivity', title: 'Complete 3 tasks today', tokens: 15, xp: 75, completed: false, expiresAt: '' },
  { id: 'c3', type: 'Micro', title: 'Answer productivity trivia', tokens: 20, xp: 100, completed: false, expiresAt: '' },
  { id: 'c4', type: 'Social', title: 'Invite a friend to Dopa', tokens: 25, xp: 125, completed: false, expiresAt: '' },
];

const THEMES: Record<string, { primary: string; accent: string }> = {
  default: { primary: '#7C3AED', accent: '#F59E0B' },
  cyberpunk: { primary: '#FF00FF', accent: '#00FFFF' },
  minimal: { primary: '#FFFFFF', accent: '#6B7280' },
  emerald: { primary: '#10B981', accent: '#34D399' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toast, setToast] = useState<{ message: string; onUndo?: () => void } | null>(null);
  const [todayFocusId, setTodayFocusId] = useState<string | null>(null);

  // Task Notifications Logic
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (!task.completed && task.dueDate) {
          const dueDate = new Date(task.dueDate);
          const diff = dueDate.getTime() - now.getTime();
          const minutesLeft = Math.floor(diff / 60000);
          
          if (minutesLeft === 10) {
            setToast({ message: `⏰ "${task.title}" is due in 10 minutes!` });
          }
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);
  // Persistence & Initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('dopa_user');
    const savedTasks = localStorage.getItem('dopa_tasks');
    const savedChallenges = localStorage.getItem('dopa_challenges');
    const savedFocus = localStorage.getItem('dopa_focus');
    const onboardingDone = localStorage.getItem('dopa_onboarded');

    if (onboardingDone) {
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const savedName = localStorage.getItem('dopa_username');
        if (savedName) parsedUser.displayName = savedName;
        setUser(parsedUser);
      }
      
      const lastReset = localStorage.getItem('dopa_last_reset');
      const today = new Date().toDateString();
      const isNewDay = lastReset !== today;

      if (savedTasks) {
        const parsedTasks: Task[] = JSON.parse(savedTasks);
        if (isNewDay) {
          const resetTasks = parsedTasks.map(t => {
            if (t.completed && t.recurrence && t.recurrence !== 'None') {
              const day = new Date().getDay();
              if (t.recurrence === 'Daily') return { ...t, completed: false };
              if (t.recurrence === 'Weekdays' && day >= 1 && day <= 5) return { ...t, completed: false };
              if (t.recurrence === 'Weekly') {
                const created = new Date(t.createdAt).getDay();
                if (created === day) return { ...t, completed: false };
              }
            }
            return t;
          });
          setTasks(resetTasks);
        } else {
          setTasks(parsedTasks);
        }
      }

      if (savedChallenges) {
        const parsedChallenges = JSON.parse(savedChallenges);
        if (isNewDay) {
          setChallenges(MOCK_CHALLENGES.map(c => ({ ...c, completed: false })));
        } else {
          setChallenges(parsedChallenges);
        }
      }

      if (isNewDay) {
        localStorage.setItem('dopa_last_reset', today);
      }
      if (savedFocus) setTodayFocusId(savedFocus);
    } else {
      setShowOnboarding(true);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (user) localStorage.setItem('dopa_user', JSON.stringify(user));
    if (tasks.length > 0) localStorage.setItem('dopa_tasks', JSON.stringify(tasks));
    if (challenges.length > 0) localStorage.setItem('dopa_challenges', JSON.stringify(challenges));
    if (todayFocusId) localStorage.setItem('dopa_focus', todayFocusId);
    else localStorage.removeItem('dopa_focus');
  }, [user, tasks, challenges, todayFocusId]);

  // Apply Theme
  useEffect(() => {
    if (user) {
      const theme = THEMES[user.activeTheme] || THEMES.default;
      document.documentElement.style.setProperty('--primary-color', theme.primary);
      document.documentElement.style.setProperty('--accent-color', theme.accent);
    }
  }, [user?.activeTheme]);

  const handleToggleTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;
      
      const isCompleting = !task.completed;
      
      if (isCompleting && user) {
        const isFocusTask = taskId === todayFocusId;
        const xpBonus = isFocusTask ? 75 : 50; // 50 base + 25 bonus if focus
        setUser(u => u ? { ...u, xp: u.xp + xpBonus } : null);
        if (isFocusTask) {
          setToast({ message: 'Focus Task Complete! +25 Bonus XP ⚡' });
        }
      }

      return prev.map(t => t.id === taskId ? { ...t, completed: isCompleting } : t);
    });
  }, [user, todayFocusId]);

  const handleDeleteTask = useCallback((taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (taskId === todayFocusId) setTodayFocusId(null);

    setToast({
      message: 'Task deleted',
      onUndo: () => {
        setTasks(prev => [taskToDelete, ...prev]);
        // Note: we don't restore focus state here for simplicity
      },
    });
    setTimeout(() => setToast(null), 4000);
  }, [tasks, todayFocusId]);

  const handleAddTask = useCallback((taskData: Partial<Task>) => {
    if (!user) return;
    
    const activeTasksCount = tasks.filter(t => !t.completed).length;
    if (!user.isPremium && activeTasksCount >= 10) {
      setToast({ message: 'Free limit reached! Unlock unlimited tasks in Store 🪙' });
      return;
    }

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      title: taskData.title || 'New Task',
      priority: taskData.priority || 'Medium',
      completed: false,
      subtasks: [],
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    setTasks(prev => [newTask, ...prev]);
  }, [user, tasks]);

  const handleUpdateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  }, []);

  const handlePinTask = useCallback((taskId: string) => {
    setTodayFocusId(prev => prev === taskId ? null : taskId);
    setToast({ message: todayFocusId === taskId ? 'Focus unpinned' : 'Pinned as Today\'s Focus ⭐' });
  }, [todayFocusId]);

  const handleCompleteChallenge = useCallback((challengeId: string, bonusXp = 0, bonusTokens = 0) => {
    setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, completed: true } : c));
    if (user) {
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge) {
        setUser({
          ...user,
          tokens: user.tokens + challenge.tokens + bonusTokens,
          xp: user.xp + challenge.xp + bonusXp,
        });
        // Celebration logic would be triggered here in components
      }
    }
  }, [user, challenges]);

  const handlePurchase = useCallback((item: StoreItem) => {
    if (user && user.tokens >= item.price) {
      setUser({
        ...user,
        tokens: user.tokens - item.price,
        isPremium: item.type === 'Premium' ? true : user.isPremium,
        unlockedThemes: item.type === 'Theme' ? [...user.unlockedThemes, item.id] : user.unlockedThemes,
        activeTheme: item.type === 'Theme' ? item.id.replace('theme-', '') : user.activeTheme,
      });
      setToast({ message: `${item.name} unlocked! ✨` });
    }
  }, [user]);

  const handleUpdateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(u => u ? { ...u, ...updates } : null);
  }, []);

  const handleOnboardingComplete = (data: { name: string; goals: string[]; firstChallengeClaimed: boolean }) => {
    const userName = data.name.trim() || 'Champion';
    const newUser: UserProfile = {
      ...MOCK_USER,
      displayName: userName,
      tokens: data.firstChallengeClaimed ? 10 : 0,
      xp: data.firstChallengeClaimed ? 50 : 0,
      goalCategories: data.goals,
    };
    setUser(newUser);
    setTasks([]); // Start fresh
    setChallenges(MOCK_CHALLENGES.map(c => ({ ...c, completed: false }))); // Start fresh
    setShowOnboarding(false);
    localStorage.setItem('dopa_onboarded', 'true');
    localStorage.setItem('dopa_username', userName);
    localStorage.setItem('dopa_last_reset', new Date().toDateString());
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'home' && (
        <Dashboard
          user={user}
          tasks={tasks}
          challenges={challenges}
          todayFocusId={todayFocusId}
          onAddTask={() => setActiveTab('tasks')}
          onGoToStore={() => setActiveTab('store')}
          onToggleTask={handleToggleTask}
          onUpdateTask={handleUpdateTask}
          onAddTaskDirect={handleAddTask}
          onPinTask={handlePinTask}
        />
      )}
      {activeTab === 'tasks' && (
        <Tasks
          user={user}
          tasks={tasks}
          todayFocusId={todayFocusId}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onPinTask={handlePinTask}
        />
      )}
      {activeTab === 'calendar' && (
        <Calendar
          tasks={tasks}
          onPlanMyDay={() => console.log('AI Planning...')}
          onAddTask={handleAddTask}
        />
      )}
      {activeTab === 'challenges' && (
        <Challenges
          challenges={challenges}
          onCompleteChallenge={handleCompleteChallenge}
        />
      )}
      {activeTab === 'profile' && (
        <Profile
          user={user}
          onLogout={() => setUser(null)}
          onUpdateProfile={handleUpdateUser}
        />
      )}
      {activeTab === 'store' && (
        <Store
          user={user}
          onPurchase={handlePurchase}
        />
      )}
      
      <Chat />

      {/* Global Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] glass px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl"
          >
            <span className="text-sm font-medium">{toast.message}</span>
            {toast.onUndo && (
              <button
                onClick={() => {
                  toast.onUndo?.();
                  setToast(null);
                }}
                className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
              >
                Undo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
