"use client";

import React from 'react';
import { Briefcase } from 'lucide-react';

export default function OpportunitiesPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <Briefcase size={64} style={{ color: '#6366f1', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Opportunities Module</h1>
      <p style={{ color: '#666', marginTop: '10px' }}>
        This module is currently under development. Here you will be able to manage your sales deals and pipeline.
      </p>
    </div>
  );
}
