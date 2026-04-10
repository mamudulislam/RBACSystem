"use client";

import React from 'react';
import { Calendar } from 'lucide-react';

export default function TaskCalendarPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <Calendar size={64} style={{ color: '#10b981', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Task Calendar</h1>
      <p style={{ color: '#666', marginTop: '10px' }}>
        View your task deadlines and events in a calendar view.
      </p>
    </div>
  );
}
