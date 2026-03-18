/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Coins, Zap, Shield, Palette, Sparkles, CheckCircle2, ShoppingBag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreItem, UserProfile } from '../types';
import { STORE_ITEMS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StoreProps {
  user: UserProfile;
  onPurchase: (item: StoreItem) => void;
}

const StoreItemIcon = ({ type }: { type: StoreItem['type'] }) => {
  switch (type) {
    case 'Premium': return <Sparkles className="text-primary" size={24} />;
    case 'Theme': return <Palette className="text-accent" size={24} />;
    case 'Utility': return <Shield className="text-blue-500" size={24} />;
  }
};

export const Store = ({ user, onPurchase }: StoreProps) => {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handlePurchase = (item: StoreItem) => {
    setPurchasingId(item.id);
    setTimeout(() => {
      onPurchase(item);
      setPurchasingId(null);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-heading tracking-tight">Token Store</h2>
          <p className="text-text-muted font-medium text-lg">Premium is earned, not bought. 🪙</p>
        </div>
        <div className="flex items-center gap-4 glass px-8 py-4 rounded-3xl border-accent/20">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Your Balance</span>
            <span className="text-3xl font-mono font-bold text-accent">{user.tokens}</span>
          </div>
          <Coins className="text-accent" size={40} fill="currentColor" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {STORE_ITEMS.map((item) => {
          const canAfford = user.tokens >= item.price;
          const isOwned = user.unlockedThemes.includes(item.id) || (item.type === 'Premium' && user.isPremium);
          const isEquipped = item.type === 'Theme' && user.activeTheme === item.id.replace('theme-', '');
          const isPurchasing = purchasingId === item.id;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              className={cn(
                'card p-8 flex flex-col gap-8 relative overflow-hidden transition-all border-white/5',
                canAfford ? 'border-success/20' : 'opacity-80'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="p-4 rounded-2xl bg-white/5">
                  <StoreItemIcon type={item.type} />
                </div>
                <div className="flex items-center gap-2 text-accent font-mono font-bold text-xl">
                  <Coins size={20} fill="currentColor" />
                  <span>{item.price}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border',
                    item.type === 'Premium' ? 'text-primary border-primary/20' : 'text-text-muted border-white/10'
                  )}>
                    {item.type}
                  </span>
                  {item.durationDays && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      {item.durationDays} Days
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-heading leading-tight">{item.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
              </div>

              <div className="relative">
                <button
                  disabled={!canAfford || isOwned || isPurchasing}
                  onClick={() => handlePurchase(item)}
                  onMouseEnter={() => !canAfford && setShowTooltip(item.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                  className={cn(
                    'w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3',
                    isOwned
                      ? 'bg-success/10 text-success border border-success/20 cursor-default'
                      : canAfford
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-white/5 text-text-muted border border-white/10 cursor-not-allowed',
                    isPurchasing && 'opacity-0'
                  )}
                >
                  {isOwned ? (
                    <>
                      <CheckCircle2 size={20} />
                      {isEquipped ? 'Equipped ✓' : 'Active ✓'}
                    </>
                  ) : canAfford ? (
                    <>
                      <ShoppingBag size={20} />
                      Unlock Now
                    </>
                  ) : (
                    <>
                      <AlertCircle size={20} />
                      Not Enough Tokens
                    </>
                  )}
                </button>

                {/* Tooltip */}
                <AnimatePresence>
                  {showTooltip === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 right-0 mb-4 glass p-4 rounded-2xl text-xs text-center space-y-2 z-50 shadow-2xl border-accent/20"
                    >
                      <p className="font-bold text-accent">You need {item.price - user.tokens} more tokens! 🪙</p>
                      <p className="text-text-muted">Complete daily challenges to earn more.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Purchase Animation Overlay */}
                <AnimatePresence>
                  {isPurchasing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ 
                          y: [-20, -100],
                          opacity: [1, 0],
                          scale: [1, 1.5]
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-accent"
                      >
                        <Coins size={32} fill="currentColor" />
                      </motion.div>
                      <motion.div
                        animate={{ 
                          scale: [0, 2],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 0.8 }}
                        className="absolute text-primary"
                      >
                        <Sparkles size={48} />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {canAfford && !isOwned && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Premium Perks Section */}
      <section className="card bg-gradient-to-br from-primary/20 via-surface to-accent/10 p-10 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-heading tracking-tight">Why Go Premium?</h3>
          <p className="text-text-muted font-medium">Earn it once, keep the momentum forever. 🚀</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Zap, title: 'AI Task Suggestions', desc: 'Break down goals instantly.' },
            { icon: Shield, title: 'Unlimited Tasks', desc: 'No more caps on your productivity.' },
            { icon: Palette, title: 'Custom Themes', desc: 'Personalize your workspace.' },
            { icon: Sparkles, title: 'Advanced Analytics', desc: 'Visualize your progress.' },
          ].map((perk, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-white/5">
                <perk.icon className="text-primary" size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-sm uppercase tracking-wider">{perk.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
