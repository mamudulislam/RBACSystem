"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#FAFAFA',
      padding: '20px',
      textAlign: 'center'
    }}>
      <ShieldAlert size={80} color="#FF5C35" style={{ marginBottom: '24px' }} />
      <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1A1A2E' }}>403 - Access Denied</h1>
      <p style={{ 
        maxWidth: '500px', 
        color: '#666', 
        fontSize: '18px', 
        lineHeight: '1.6',
        marginTop: '16px',
        marginBottom: '32px'
      }}>
        You don't have the required permission atom to access this module. 
        Please contact your administrator if you believe this is an error.
      </p>
      <Link href="/dashboard" style={{
        background: '#FF5C35',
        color: 'white',
        padding: '14px 32px',
        borderRadius: '12px',
        fontWeight: '700',
        textDecoration: 'none',
        boxShadow: '0 4px 15px rgba(255, 92, 53, 0.3)',
        transition: 'transform 0.2s'
      }}>
        Return to Dashboard
      </Link>
    </div>
  );
}
