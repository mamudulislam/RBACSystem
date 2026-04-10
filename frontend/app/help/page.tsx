"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <HelpCircle size={64} style={{ color: '#999', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Help Center</h1>
      <p style={{ color: '#666', marginTop: '10px' }}>
        Support and documentation for the RBAC System.
      </p>
    </div>
  );
}
