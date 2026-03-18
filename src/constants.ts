/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoreItem, Badge } from './types';

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'premium-monthly',
    type: 'Premium',
    name: 'Dopa Premium',
    description: 'Unlock AI task breakdown, advanced analytics, and unlimited themes.',
    price: 500,
    durationDays: 30,
  },
  {
    id: 'theme-cyberpunk',
    type: 'Theme',
    name: 'Cyberpunk Neon',
    description: 'A vibrant high-contrast theme for night owls.',
    price: 150,
  },
  {
    id: 'theme-minimal',
    type: 'Theme',
    name: 'Pure Minimalist',
    description: 'Clean, distraction-free interface for deep focus.',
    price: 100,
  },
  {
    id: 'streak-freeze',
    type: 'Utility',
    name: 'Streak Freeze',
    description: 'Protect your streak for one day if you miss your goals.',
    price: 50,
  },
  {
    id: 'xp-boost',
    type: 'Utility',
    name: '2x XP Boost',
    description: 'Earn double XP for the next 24 hours.',
    price: 200,
    durationDays: 1,
  },
];

export const BADGES: Badge[] = [
  { id: 'rookie', name: 'Rookie', icon: '🌱', description: 'Started the journey.' },
  { id: 'streak-7', name: 'Week Warrior', icon: '🔥', description: '7-day streak achieved.' },
  { id: 'streak-30', name: 'Monthly Legend', icon: '🏆', description: '30-day streak achieved.' },
  { id: 'token-1000', name: 'Token Stacked', icon: '💰', description: 'Earned 1000 tokens.' },
  { id: 'task-master', name: 'Task Master', icon: '⚡', description: 'Completed 100 tasks.' },
  { id: 'ai-pioneer', name: 'AI Pioneer', icon: '🤖', description: 'Used AI planning for the first time.' },
  { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: 'Completed 5 tasks before 8 AM.' },
  { id: 'night-owl', name: 'Night Owl', icon: '🦉', description: 'Completed 5 tasks after 10 PM.' },
];
