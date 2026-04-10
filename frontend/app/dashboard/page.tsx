"use client";

import React from 'react';
import styles from './dashboard.module.css';
import { Target, CheckSquare, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.fullName || 'User';

  return (
    <div className="animate-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--foreground)' }}>
          Welcome back, {userName.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Here's what's happening in your workspace today.
        </p>
      </header>

      <div className={styles.grid}>
        {[
          { label: 'Total Leads', value: '1,245', icon: Target, color: '#6366f1' },
          { label: 'Active Tasks', value: '42', icon: CheckSquare, color: '#10b981' },
          { label: 'Conversion', value: '18.5%', icon: TrendingUp, color: '#f59e0b' },
          { label: 'Revenue', value: '$12,500', icon: BarChart3, color: '#ef4444' },
        ].map((stat, i) => (
          <div key={i} className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className={styles.cardLabel}>{stat.label}</p>
                <h2 className={styles.cardValue}>{stat.value}</h2>
              </div>
              <div style={{ 
                padding: '0.5rem', 
                background: `${stat.color}15`, 
                color: stat.color,
                borderRadius: '0.5rem'
              }}>
                <stat.icon size={20} />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981' }}>
              <span>+12.5%</span>
              <TrendingUp size={12} />
              <span style={{ color: 'var(--secondary)' }}>from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.activityCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className={styles.activityTitle}>Recent Activity</h3>
          <button style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>View All</button>
        </div>
        <div className={styles.emptyState}>
          <Calendar size={48} strokeWidth={1.5} />
          <p>No recent activity logs found.</p>
          <button style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            Refresh Activity
          </button>
        </div>
      </div>
    </div>
  );
}
