"use client";

import React, { useState } from 'react';
import { Target, Search, Filter, MoreHorizontal, UserPlus, Phone, Mail } from 'lucide-react';
import styles from './leads.module.css';

export default function LeadsPage() {
  const [leads, setLeads] = useState([
    { id: 1, name: 'Esther Howard', email: 'esther.h@example.com', phone: '(205) 555-0100', status: 'New', source: 'Website', value: '$2,500' },
    { id: 2, name: 'Cameron Williamson', email: 'cameron.w@example.com', phone: '(208) 555-0112', status: 'Contacted', source: 'Referral', value: '$1,200' },
    { id: 3, name: 'Jane Cooper', email: 'jane.c@example.com', phone: '(219) 555-0114', status: 'Qualified', source: 'LinkedIn', value: '$5,000' },
    { id: 4, name: 'Robert Fox', email: 'robert.f@example.com', phone: '(229) 555-0109', status: 'Lost', source: 'Website', value: '$800' },
    { id: 5, name: 'Guy Hawkins', email: 'guy.h@example.com', phone: '(406) 555-0120', status: 'New', source: 'Direct', value: '$3,100' },
  ]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Leads Management</h1>
          <p className={styles.subtitle}>Track and convert your sales pipeline leads efficiently.</p>
        </div>
        <button className={styles.addBtn}>
          <UserPlus size={18} />
          <span>Add New Lead</span>
        </button>
      </header>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search size={18} />
          <input type="text" placeholder="Search leads..." />
        </div>
        <button className={styles.filterBtn}>
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Contact info</th>
              <th>Source</th>
              <th>Value</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div className={styles.leadName}>
                    <div className={styles.avatar}>{lead.name[0]}</div>
                    <span className={styles.bold}>{lead.name}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.contactInfo}>
                    <div className={styles.infoItem}><Mail size={12} /> {lead.email}</div>
                    <div className={styles.infoItem}><Phone size={12} /> {lead.phone}</div>
                  </div>
                </td>
                <td><span className={styles.sourceBadge}>{lead.source}</span></td>
                <td className={styles.bold}>{lead.value}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[lead.status.toLowerCase()]}`}>
                    {lead.status}
                  </span>
                </td>
                <td>
                  <button className={styles.actionBtn}>
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
