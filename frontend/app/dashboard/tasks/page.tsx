"use client";

import React, { useState, useEffect } from 'react';
import { Plus, GripVertical, MoreHorizontal, Clock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';
import styles from './tasks.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function TasksPage() {
  const [columns, setColumns] = useState([
    { id: 'TODO', title: 'To Do', tasks: [] },
    { id: 'IN_PROGRESS', title: 'In Progress', tasks: [] },
    { id: 'DONE', title: 'Completed', tasks: [] }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`, { withCredentials: true });
      const tasks = res.data;
      
      setColumns([
        { id: 'TODO', title: 'To Do', tasks: tasks.filter((t: any) => t.status === 'TODO') },
        { id: 'IN_PROGRESS', title: 'In Progress', tasks: tasks.filter((t: any) => t.status === 'IN_PROGRESS') },
        { id: 'DONE', title: 'Completed', tasks: tasks.filter((t: any) => t.status === 'DONE') }
      ]);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/tasks`, newTask, { withCredentials: true });
      setShowModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM' });
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus }, { withCredentials: true });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, { withCredentials: true });
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Loading tasks...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Project Tasks</h1>
          <p className={styles.subtitle}>Manage and track your project deliverables.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Plus size={20} />
          <span>Create Task</span>
        </button>
      </header>

      <div className={styles.board}>
        {columns.map((column) => (
          <div key={column.id} className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <h3>{column.title}</h3>
                <span className={styles.count}>{column.tasks.length}</span>
              </div>
              <MoreHorizontal size={18} className={styles.icon} />
            </div>

            <div className={styles.taskList}>
              {column.tasks.map((task: any) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <span className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}>
                      {task.priority}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        className={styles.statusBtn}
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete task"
                      >
                        <X size={14} />
                      </button>
                      <GripVertical size={16} className={styles.dragHandle} />
                    </div>
                  </div>
                  <h4 className={styles.taskTitle}>{task.title}</h4>
                  {task.description && <p className={styles.taskDesc}>{task.description}</p>}
                  
                  <div className={styles.taskFooter}>
                    <div className={styles.statusInfo}>
                      {column.id === 'TODO' && <Clock size={14} />}
                      {column.id === 'IN_PROGRESS' && <AlertCircle size={14} style={{ color: '#f59e0b' }} />}
                      {column.id === 'DONE' && <CheckCircle2 size={14} style={{ color: '#10b981' }} />}
                      <span>{column.title}</span>
                    </div>
                    <select 
                      className={styles.statusSelect}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>
              ))}
              <button 
                className={styles.addColumnTask}
                onClick={() => {
                  setNewTask({ ...newTask });
                  setShowModal(true);
                }}
              >
                <Plus size={16} />
                <span>Add task</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Task</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className={styles.form} onSubmit={handleCreateTask}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title</label>
                <input
                  type="text"
                  className={styles.input}
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                  rows={3}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Priority</label>
                <select
                  className={styles.select}
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
