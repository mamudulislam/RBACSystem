"use client";

import React from 'react';
import { User, Shield, Bell, Moon, Globe, LogOut, ChevronRight } from 'lucide-react';
import styles from './settings.module.css';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  const sections = [
    {
      title: 'Profile Settings',
      items: [
        { label: 'Edit Personal Information', icon: User, desc: 'Change your name, email and avatar' },
        { label: 'Login & Security', icon: Shield, desc: 'Manage password and 2-factor auth' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Notifications', icon: Bell, desc: 'Manage push and email alerts' },
        { label: 'Display & Appearance', icon: Moon, desc: 'Dark mode and UI density' },
        { label: 'Language & Region', icon: Globe, desc: 'System language and timezone' },
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>System Settings</h1>
        <p className={styles.subtitle}>Manage your account and platform preferences.</p>
      </header>

      <div className={styles.profileCard}>
        <div className={styles.avatar}>{user?.fullName[0]}</div>
        <div className={styles.userInfo}>
           <h3>{user?.fullName}</h3>
           <p>{user?.email}</p>
           <span className={styles.roleTag}>{user?.role}</span>
        </div>
        <button onClick={() => logout()} className={styles.logoutBtn}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className={styles.sections}>
         {sections.map((section, i) => (
           <div key={i} className={styles.section}>
              <h4 className={styles.sectionTitle}>{section.title}</h4>
              <div className={styles.itemList}>
                {section.items.map((item, j) => (
                  <div key={j} className={styles.item}>
                    <div className={styles.itemIcon}>
                      <item.icon size={20} />
                    </div>
                    <div className={styles.itemInfo}>
                       <h5>{item.label}</h5>
                       <p>{item.desc}</p>
                    </div>
                    <ChevronRight size={18} className={styles.chevron} />
                  </div>
                ))}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
