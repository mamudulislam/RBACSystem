"use client";

import React, { useState, useEffect } from 'react';
import styles from './PermissionEditor.module.css';

interface Permission {
  id: string;
  atom: string;
  description: string;
}

interface User {
  id: string;
  fullName: string;
  role: string;
  permissions: { permission: Permission }[];
}

export default function PermissionEditor({ 
  user, 
  allPermissions,
  currentUserPermissions = [],
  onSave,
  onCancel
}: { 
  user: User, 
  allPermissions: Permission[],
  currentUserPermissions: string[],
  onSave: (atoms: string[]) => void,
  onCancel: () => void
}) {
  const [selectedAtoms, setSelectedAtoms] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const perms = user.permissions || [];
    const atoms = perms
      .filter(p => p && p.permission)
      .map(p => p.permission.atom)
      .filter(Boolean);
    setSelectedAtoms(atoms);
  }, [user]);

  const togglePermission = (atom: string) => {
    if (!currentUserPermissions.includes(atom)) return;
    
    setSelectedAtoms(prev => 
      prev.includes(atom) ? prev.filter(a => a !== atom) : [...prev, atom]
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Edit Permissions for {user.fullName}</h2>
          <p>Role: {user.role}</p>
          <p className={styles.grantCeilingNote}>
            Note: You can only grant/revoke permissions that you also hold.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.grid}>
            {allPermissions.map((permission) => {
              const hasPower = currentUserPermissions.includes(permission.atom);
              return (
                <label 
                  key={permission.id} 
                  className={`${styles.item} ${!hasPower ? styles.disabled : ''}`}
                >
                  <input 
                    type="checkbox" 
                    disabled={!hasPower}
                    checked={selectedAtoms.includes(permission.atom)}
                    onChange={() => togglePermission(permission.atom)}
                  />
                  <div className={styles.info}>
                    <span className={styles.atom}>{permission.atom}</span>
                    <span className={styles.description}>{permission.description}</span>
                    {!hasPower && <span className={styles.restrictedBadge}>Restricted</span>}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
          <button onClick={() => onSave(selectedAtoms)} className={styles.saveBtn}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
