"use client";

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <MessageSquare size={64} style={{ color: '#f59e0b', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Messages Module</h1>
      <p style={{ color: '#666', marginTop: '10px' }}>
        Communicate with your team here. Currently under development.
      </p>
    </div>
  );
}
