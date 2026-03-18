/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, CheckSquare, Calendar, Trophy, User, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      'flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors',
      active ? 'text-primary' : 'text-text-muted hover:text-text-primary'
    )}
  >
    <motion.div
      whileTap={{ scale: 0.9 }}
      className={cn(
        'p-1 rounded-xl transition-colors',
        active && 'bg-primary/10'
      )}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </motion.div>
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 px-4 pb-safe pt-2 z-50 md:hidden">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <NavItem
          icon={Home}
          label="Home"
          active={activeTab === 'home'}
          onClick={() => onTabChange('home')}
        />
        <NavItem
          icon={CheckSquare}
          label="Tasks"
          active={activeTab === 'tasks'}
          onClick={() => onTabChange('tasks')}
        />
        <NavItem
          icon={Calendar}
          label="Calendar"
          active={activeTab === 'calendar'}
          onClick={() => onTabChange('calendar')}
        />
        <NavItem
          icon={Trophy}
          label="Challenges"
          active={activeTab === 'challenges'}
          onClick={() => onTabChange('challenges')}
        />
        <NavItem
          icon={ShoppingBag}
          label="Store"
          active={activeTab === 'store'}
          onClick={() => onTabChange('store')}
        />
        <NavItem
          icon={User}
          label="Profile"
          active={activeTab === 'profile'}
          onClick={() => onTabChange('profile')}
        />
      </div>
    </nav>
  );
};

export const Sidebar = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-surface border-r border-white/5 p-6 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-heading text-xl">D</span>
        </div>
        <h1 className="text-2xl font-heading tracking-tight">Dopa</h1>
      </div>

      <div className="flex flex-col gap-2">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
          { id: 'calendar', icon: Calendar, label: 'Calendar' },
          { id: 'challenges', icon: Trophy, label: 'Challenges' },
          { id: 'store', icon: ShoppingBag, label: 'Store' },
          { id: 'profile', icon: User, label: 'Profile' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200',
              activeTab === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
            )}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/5">
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Pro Tip</p>
          <p className="text-sm text-text-primary leading-relaxed">
            Complete daily challenges to earn tokens for Premium features!
          </p>
        </div>
      </div>
    </aside>
  );
};
