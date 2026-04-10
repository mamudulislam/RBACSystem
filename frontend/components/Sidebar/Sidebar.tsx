"use client";

import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  CheckSquare, 
  BarChart3, 
  MessageSquare, 
  Contact, 
  Settings, 
  FileText, 
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  Briefcase,
  ShoppingCart,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', permission: 'view:dashboard' },
  { icon: Target, label: 'Leads', path: '/dashboard/leads', permission: 'view:leads' },
  { icon: Briefcase, label: 'Opportunities', path: '/dashboard/opportunities', permission: 'view:opportunities' },
  { 
    icon: CheckSquare, 
    label: 'Tasks', 
    path: '/dashboard/tasks', 
    permission: 'view:tasks',
    subItems: [
      { label: 'Assignments', path: '/dashboard/tasks/assignments' },
      { label: 'Calendar', path: '/dashboard/tasks/calendar' },
      { label: 'Reminders', path: '/dashboard/tasks/reminders' },
    ]
  },
  { icon: FileText, label: 'Audit Logs', path: '/dashboard/audit', permission: 'view:audit' },
  { icon: BarChart3, label: 'Reports', path: '/dashboard/reports', permission: 'view:reports' },
  { icon: ShoppingCart, label: 'Customer Portal', path: '/dashboard/portal', permission: 'view:portal' },
];

const userItems = [
  { icon: Contact, label: 'Contacts', path: '/dashboard/users', permission: 'manage:users' },
  { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages', badge: '5', permission: 'view:messages' },
];

const otherItems = [
  { icon: Settings, label: 'Configuration', path: '/dashboard/config', permission: 'manage:settings' },
  { icon: FileText, label: 'Invoice', path: '/dashboard/invoices', permission: 'view:invoices' },
];

export default function Sidebar({ userPermissions = [] }: { userPermissions?: string[] }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [expanded, setExpanded] = useState<string | null>('Tasks');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filterItems = (items: any[]) => {
    return items.filter(item => !item.permission || userPermissions.includes(item.permission));
  };

  const handleLogout = () => {
    logout();
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      <button className={styles.mobileToggle} onClick={toggleMobile} aria-label="Toggle menu">
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileOpen && <div className={styles.overlay} onClick={closeMobile} />}
      
      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.workspace}>
          <div className={styles.workspaceAvatar}>{user?.fullName?.[0] || 'U'}</div>
          <div className={styles.workspaceInfo}>
            <h3>{user?.fullName || 'User'}</h3>
            <p>{user?.role || 'N/A'}</p>
          </div>
          <button className={styles.mobileClose} onClick={closeMobile}>
            <ChevronLeft size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.section}>
            {filterItems(menuItems).map((item) => (
              <div key={item.path}>
                <Link 
                  href={item.path} 
                  className={`${styles.navItem} ${pathname.startsWith(item.path) ? styles.active : ''}`}
                  onClick={(e) => {
                    if (item.subItems) {
                      e.preventDefault();
                      setExpanded(expanded === item.label ? null : item.label);
                    } else {
                      closeMobile();
                    }
                  }}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                  {item.subItems && (
                    <ChevronDown 
                      size={14} 
                      className={styles.chevron} 
                      style={{ transform: expanded === item.label ? 'rotate(180deg)' : 'none' }} 
                    />
                  )}
                </Link>
                {item.subItems && expanded === item.label && (
                  <div className={styles.subItems}>
                    {item.subItems.map((sub: any) => (
                      <Link 
                        key={sub.path} 
                        href={sub.path} 
                        className={`${styles.subItem} ${pathname === sub.path ? styles.active : ''}`}
                        onClick={closeMobile}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Users</h4>
            {filterItems(userItems).map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                onClick={closeMobile}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {item.badge && <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#999' }}>{item.badge}</span>}
              </Link>
            ))}
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Other</h4>
            {filterItems(otherItems).map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                onClick={closeMobile}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className={styles.footer}>
          <Link href="/help" className={styles.footerItem}>
            <HelpCircle size={20} />
            <span>Help center</span>
          </Link>
          <button onClick={handleLogout} className={styles.footerItem}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
