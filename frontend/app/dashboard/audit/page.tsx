"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './audit.module.css';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:3001/audit', { withCredentials: true });
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>System Audit Log</h1>
        <p className={styles.subtitle}>Trace every administrative action performed in the system.</p>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Payload</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className={styles.timestamp}>{new Date(log.timestamp).toLocaleString()}</td>
                <td>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{log.user?.fullName}</span>
                    <span className={styles.userEmail}>{log.user?.email}</span>
                  </div>
                </td>
                <td><span className={styles.actionBadge}>{log.action}</span></td>
                <td>{log.resource}</td>
                <td className={styles.payload}>
                  <pre>{log.payload ? JSON.stringify(JSON.parse(log.payload), null, 2) : '-'}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
