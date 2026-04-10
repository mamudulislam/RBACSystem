"use client";

import React from 'react';
import { BarChart3, TrendingUp, Users, Target, Calendar, Download } from 'lucide-react';
import styles from './reports.module.css';

export default function ReportsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>System Analytics</h1>
          <p className={styles.subtitle}>Actionable insights and performance metrics.</p>
        </div>
        <button className={styles.exportBtn}>
          <Download size={18} />
          <span>Export PDF</span>
        </button>
      </header>

      <div className={styles.grid}>
        <div className={styles.mainChart}>
          <div className={styles.cardHeader}>
            <h3>Conversion Overview</h3>
            <div className={styles.periods}>
              <span>1W</span>
              <span className={styles.activePeriod}>1M</span>
              <span>3M</span>
              <span>1Y</span>
            </div>
          </div>
          <div className={styles.chartArea}>
              {/* Dummy SVG Chart */}
              <svg viewBox="0 0 800 200" className={styles.svg}>
                <path d="M0,150 Q200,50 400,120 T800,80" fill="none" stroke="#FF5C35" strokeWidth="4" />
                <path d="M0,150 Q200,50 400,120 T800,80 V200 H0 Z" fill="url(#gradient)" opacity="0.1" />
                <defs>
                   <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#FF5C35" />
                     <stop offset="100%" stopColor="white" />
                   </linearGradient>
                </defs>
              </svg>
          </div>
        </div>

        <div className={styles.sideStats}>
          {[
            { label: 'Active Agents', value: '24', icon: Users, color: '#6366f1' },
            { label: 'Lead Velocity', value: '+12.5%', icon: TrendingUp, color: '#10b981' },
            { label: 'Conversion Rate', value: '18.4%', icon: Target, color: '#f59e0b' },
          ].map((stat, i) => (
            <div key={i} className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className={styles.statLabel}>{stat.label}</p>
                  <h4 className={styles.statValue}>{stat.value}</h4>
                </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Top Performers</h3>
          </div>
          <div className={styles.list}>
             {[
               { name: 'Alex Johnson', deals: 42, rev: '$24,500' },
               { name: 'Sarah Miller', deals: 38, rev: '$21,200' },
               { name: 'Michael Chen', deals: 31, rev: '$18,900' },
             ].map((p, i) => (
               <div key={i} className={styles.listItem}>
                  <span>{p.name}</span>
                  <div className={styles.listData}>
                    <span className={styles.deals}>{p.deals} deals</span>
                    <span className={styles.rev}>{p.rev}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Recent Milestones</h3>
          </div>
          <div className={styles.timeline}>
             {[
               { t: 'Completed RBAC Security Audit', d: '2 hours ago' },
               { t: 'Added 500+ Qualified Leads', d: 'Yesterday' },
               { t: 'New Feature Launch: Kanban Board', d: 'Mar 28, 2024' },
             ].map((m, i) => (
               <div key={i} className={styles.milestone}>
                  <div className={styles.dot} />
                  <div className={styles.milestoneInfo}>
                    <p className={styles.milestoneText}>{m.t}</p>
                    <span className={styles.milestoneDate}>{m.d}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
