"use client";

import React from 'react';
import { CheckSquare } from 'lucide-react';

export default function TaskAssignmentsPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <CheckSquare size={64} style={{ color: '#10b981', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Task Assignments</h1>
      <p style={{ color: '#666', marginTop: '10px' }}>
        View and manage your project assignments here.
      </p>
    </div>
  );
}
