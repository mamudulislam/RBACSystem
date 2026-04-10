"use client";

import React from 'react';
import { FileText } from 'lucide-react';

export default function InvoicesPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <FileText size={64} style={{ color: '#ef4444', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Invoices Module</h1>
      <p style={{ color: '#666', marginTop: '10px' }}>
        Billing and invoice management here. Currently under development.
      </p>
    </div>
  );
}
