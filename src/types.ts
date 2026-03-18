/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'Low' | 'Medium' | 'High';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: string;
  dueDate?: string;
  projectFolder?: string;
  recurrence?: 'None' | 'Daily' | 'Weekdays' | 'Weekly';
  notes?: string;
}

export interface Challenge {
  id: string;
  type: 'Habit' | 'Productivity' | 'Micro' | 'Social';
  title: string;
  tokens: number;
  xp: number;
  completed: boolean;
  expiresAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface StoreItem {
  id: string;
  type: 'Premium' | 'Theme' | 'Utility';
  name: string;
  description: string;
  price: number;
  durationDays?: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  tokens: number;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  streakFreezeCount: number;
  isPremium: boolean;
  badges: string[];
  unlockedThemes: string[];
  activeTheme: string;
  username?: string;
  goalCategories?: string[];
}
