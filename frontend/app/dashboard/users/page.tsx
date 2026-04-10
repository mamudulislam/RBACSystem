"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import PermissionEditor from './PermissionEditor';
import styles from './users.module.css';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'AGENT',
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/permissions`, { withCredentials: true });
      setAllPermissions(res.data);
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    }
  };

  const handleSavePermissions = async (atoms: string[]) => {
    try {
      await axios.post(`${API_URL}/users/${editingUser.id}/permissions`, { atoms }, { withCredentials: true });
      setMessage('Permissions updated successfully!');
      setEditingUser(null);
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.response?.data?.message || 'Failed to update permissions'}`);
    }
  };

  const handleToggleStatus = async (userId: string, field: string) => {
    try {
      await axios.post(`${API_URL}/users/${userId}/status`, { field }, { withCredentials: true });
      setMessage(`User status updated successfully!`);
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.response?.data?.message || 'Failed to update status'}`);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await axios.post(`${API_URL}/users`, newUser, { withCredentials: true });
      setMessage('User created successfully!');
      setShowCreateModal(false);
      setNewUser({ email: '', password: '', fullName: '', role: 'AGENT' });
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.response?.data?.message || 'Failed to create user'}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Manage team members and their granular permissions.</p>
        </div>
        <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Create User
        </button>
      </div>

      {message && <div className={styles.alert}>{message}</div>}

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>{user.fullName[0]}</div>
                    <span>{user.fullName}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td className={styles.roleBadge}>{user.role}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span 
                      className={`${styles.status} ${user.isActive ? styles.active : styles.inactive}`}
                      onClick={() => handleToggleStatus(user.id, 'isActive')}
                      style={{ cursor: 'pointer' }}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {user.isSuspended && <span className={styles.suspendedTag}>Suspended</span>}
                    {user.isBanned && <span className={styles.bannedTag}>Banned</span>}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className={styles.editBtn}
                      onClick={() => setEditingUser(user)}
                    >
                      Permissions
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${user.isSuspended ? styles.activeAction : ''}`}
                      onClick={() => handleToggleStatus(user.id, 'isSuspended')}
                      title="Suspend User"
                    >
                      {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${user.isBanned ? styles.activeAction : ''}`}
                      onClick={() => handleToggleStatus(user.id, 'isBanned')}
                      style={{ background: '#ef4444', color: 'white' }}
                      title="Ban User"
                    >
                      {user.isBanned ? 'Unban' : 'Ban'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <PermissionEditor 
          user={editingUser}
          allPermissions={allPermissions}
          currentUserPermissions={currentUser?.permissions || []}
          onSave={handleSavePermissions}
          onCancel={() => setEditingUser(null)}
        />
      )}

      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New User</h2>
              <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className={styles.form} onSubmit={handleCreateUser}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  className={styles.input}
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                  required
                  minLength={8}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Role</label>
                <select
                  className={styles.select}
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="AGENT">Agent</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                  <option value="CUSTOMER">Customer</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
