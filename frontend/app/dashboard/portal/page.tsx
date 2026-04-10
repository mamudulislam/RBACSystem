"use client";

import React from 'react';
import { ShoppingCart, Package, Heart, CreditCard, MessageCircle, Settings } from 'lucide-react';
import styles from './portal.module.css';
import { useAuth } from '@/context/AuthContext';

export default function CustomerPortal() {
  const { user } = useAuth();

  const stats = [
    { label: 'Orders', value: '12', icon: Package, color: '#6366f1' },
    { label: 'Wishlist', value: '45', icon: Heart, color: '#ec4899' },
    { label: 'Support Tickets', value: '2', icon: MessageCircle, color: '#10b981' },
    { label: 'Active Subscriptions', value: '1', icon: CreditCard, color: '#f59e0b' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back, {user?.fullName || 'Customer'}!</h1>
        <p className={styles.subtitle}>Manage your orders, payments, and account settings from your portal.</p>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>{stat.label}</span>
              <h2 className={styles.statValue}>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Recent Orders</h3>
              <button className={styles.viewAll}>View All</button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '#ORD-7721', date: '2024-03-15', amount: '$124.50', status: 'Delivered' },
                    { id: '#ORD-7722', date: '2024-03-22', amount: '$45.00', status: 'Processing' },
                    { id: '#ORD-7723', date: '2024-04-01', amount: '$210.00', status: 'Shipped' },
                  ].map((order, i) => (
                    <tr key={i}>
                      <td className={styles.bold}>{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[order.status.toLowerCase()]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Account Settings</h3>
            </div>
            <div className={styles.settingsList}>
              {[
                { label: 'Personal Information', icon: Settings },
                { label: 'Payment Methods', icon: CreditCard },
                { label: 'Order History', icon: Package },
                { label: 'Support Center', icon: MessageCircle },
              ].map((item, i) => (
                <div key={i} className={styles.settingItem}>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
