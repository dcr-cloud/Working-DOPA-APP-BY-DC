/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Trophy, Flame, Coins, Settings, Share2, LogOut, ShieldCheck, X, Camera, Plus, UserPlus, Zap, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Badge } from '../types';
import { BADGES } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-2xl glass rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h3 className="text-xl font-heading tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Profile = ({ user, onLogout, onUpdateProfile }: ProfileProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user.displayName,
    username: user.username || '',
    goalCategories: user.goalCategories || []
  });

  const handleUpdateProfile = () => {
    onUpdateProfile(editForm);
    setIsEditModalOpen(false);
  };

  const handleShareStats = async () => {
    const statsText = `I'm Level ${user.level} on Dopa with a ${user.streak}-day streak! 🚀 I've earned ${user.tokens} tokens and ${user.badges.length} badges. Join me and level up your productivity!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.displayName}'s Dopa Stats`,
          text: statsText,
          url: window.location.origin,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(statsText);
      alert('Stats copied to clipboard!');
    }
  };

  const xpToNextLevel = user.level * 1000;
  const xpProgress = (user.xp / xpToNextLevel) * 100;

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  ];

  const friends = [
    { name: 'Alex', level: 12, streak: 15, badges: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { name: 'Sarah', level: 8, streak: 3, badges: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { name: 'Mike', level: 21, streak: 42, badges: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-2xl shadow-primary/20 transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden border-4 border-surface relative">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-text-muted" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera size={32} />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 glass p-3 rounded-2xl shadow-xl">
            <span className="text-xl font-mono font-bold text-primary">Lv.{user.level}</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h2 className="text-4xl font-heading tracking-tight">{user.displayName}</h2>
              {user.isPremium && (
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1.5 border border-primary/20">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Premium</span>
                </div>
              )}
            </div>
            <p className="text-text-muted font-medium text-lg">@{user.username || 'achiever'}</p>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2 max-w-md mx-auto md:mx-0">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-text-muted">XP PROGRESS</span>
              <span className="text-primary">{user.xp} / {xpToNextLevel} XP</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]" 
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 glass px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/5 transition-colors"
            >
              <Settings size={18} />
              Edit Profile
            </button>
            <button 
              onClick={handleShareStats}
              className="flex items-center gap-2 glass px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/5 transition-colors"
            >
              <Share2 size={18} />
              Share Stats
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 glass px-6 py-3 rounded-2xl font-bold text-sm text-danger hover:bg-danger/10 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Flame, label: 'Current Streak', value: `${user.streak} Days`, color: 'text-accent' },
          { icon: Trophy, label: 'Longest Streak', value: `${user.longestStreak} Days`, color: 'text-primary' },
          { icon: Coins, label: 'Total Tokens', value: user.tokens, color: 'text-accent' },
          { icon: ShieldCheck, label: 'Badges Earned', value: user.badges.length, color: 'text-success' },
        ].map((stat, i) => (
          <div key={i} className="card p-6 flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-2xl bg-white/5">
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</span>
              <p className="text-2xl font-mono font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Badges Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-heading tracking-tight">Badges & Achievements</h3>
          <button 
            onClick={() => setIsBadgeModalOpen(true)}
            className="text-sm font-bold text-primary hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {BADGES.slice(0, 8).map((badge) => {
            const isUnlocked = user.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={cn(
                  'flex flex-col items-center gap-3 transition-all relative group',
                  !isUnlocked && 'opacity-40 grayscale'
                )}
              >
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all',
                  isUnlocked 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-primary/10' 
                    : 'bg-white/5 border border-white/5'
                )}>
                  {badge.icon}
                  {!isUnlocked && <Lock className="absolute top-0 right-0 text-text-muted" size={12} />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">
                  {badge.name}
                </span>
                
                {/* Tooltip for locked badges */}
                {!isUnlocked && (
                  <div className="absolute bottom-full mb-2 w-32 glass p-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-[10px] text-center font-medium">
                    {badge.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Friends & Buddies Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-heading tracking-tight">Friends & Buddies</h3>
          <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            <UserPlus size={16} />
            Add Buddy
          </button>
        </div>
        
        {friends.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed border-white/10">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl">🛸</div>
            <div className="space-y-1">
              <h4 className="font-heading text-lg">Flying solo for now</h4>
              <p className="text-sm text-text-muted">Invite a friend to stay accountable together!</p>
            </div>
            <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              Invite a friend
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {friends.map((friend, i) => (
              <div key={i} className="card p-5 flex items-center gap-4 group cursor-pointer hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-colors">
                  <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate">{friend.name}</h4>
                  <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-text-muted">
                    <span className="text-primary">LV.{friend.level}</span>
                    <span className="text-accent">{friend.streak}D STREAK</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-muted group-hover:text-primary transition-colors" />
              </div>
            ))}
            <button className="card p-5 flex flex-col items-center justify-center gap-2 border-dashed border-white/10 hover:border-primary/30 transition-all text-text-muted hover:text-primary">
              <Plus size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">Find More</span>
            </button>
          </div>
        )}
      </section>

      {/* Modals */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profile">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Display Name</label>
            <input 
              type="text" 
              value={editForm.displayName}
              onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">@</span>
              <input 
                type="text" 
                value={editForm.username}
                onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-8 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Goal Categories</label>
            <div className="flex flex-wrap gap-2">
              {['Productivity', 'Health', 'Learning', 'Finance', 'Career', 'Creativity'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    const exists = editForm.goalCategories.includes(cat);
                    setEditForm({
                      ...editForm,
                      goalCategories: exists 
                        ? editForm.goalCategories.filter(c => c !== cat)
                        : [...editForm.goalCategories, cat]
                    });
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    editForm.goalCategories.includes(cat)
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-white/5 border-white/10 text-text-muted hover:border-white/20"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={handleUpdateProfile}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      <Modal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} title="Choose Avatar">
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-6">
            {avatars.map((avatar, i) => (
              <button
                key={i}
                onClick={() => {
                  onUpdateProfile({ photoURL: avatar });
                  setIsAvatarModalOpen(false);
                }}
                className={cn(
                  "aspect-square rounded-3xl overflow-hidden border-4 transition-all hover:scale-105",
                  user.photoURL === avatar ? "border-primary" : "border-transparent"
                )}
              >
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-surface px-4 text-text-muted">Or</span></div>
          </div>
          <button className="w-full flex items-center justify-center gap-3 p-6 rounded-3xl border-2 border-dashed border-white/10 hover:border-primary/30 hover:bg-white/5 transition-all text-text-muted hover:text-primary">
            <Camera size={24} />
            <span className="font-bold uppercase tracking-widest">Upload Custom Photo</span>
          </button>
        </div>
      </Modal>

      <Modal isOpen={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)} title="Badge Gallery">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {BADGES.map((badge) => {
            const isUnlocked = user.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={cn(
                  'card p-6 flex flex-col items-center text-center gap-4 transition-all',
                  !isUnlocked && 'opacity-40 grayscale'
                )}
              >
                <div className={cn(
                  'w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl',
                  isUnlocked ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10' : 'bg-white/5 border border-white/5'
                )}>
                  {badge.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">{badge.name}</h4>
                  <p className="text-[10px] text-text-muted leading-tight">
                    {isUnlocked ? badge.description : `Unlock: ${badge.description}`}
                  </p>
                </div>
                {isUnlocked ? (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-success uppercase tracking-widest">
                    <Check size={12} />
                    Unlocked
                  </div>
                ) : (
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    Locked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};
