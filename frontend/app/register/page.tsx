"use client";

import React, { useState } from 'react';
import styles from '../login/login.module.css'; // Reusing login styles for consistency
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import loginBackground from '@/public/loginbackground.png';
import loginIcons from '@/public/loginicons.png';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/auth/register`, { 
        email, 
        password, 
        fullName 
      });
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.logo}>
          <Image 
            src={loginIcons} 
            alt="Obliq Logo" 
            width={103} 
            height={40}
            className={styles.logoIcon}
            unoptimized
          />
        </div>

        <div className={styles.card}>
          <div className={styles.header}>
            <h1>Create Account</h1>
            <p>Join the Obliq RBAC platform today</p>
          </div>

          {error && <div style={{ color: '#FF5C35', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={styles.input}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className={styles.passwordIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>

            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className={styles.footer}>
            Already have an account? <Link href="/login">Log in</Link>
          </div>
        </div>
      </div>

      <div className={styles.rightSide}>
        <Image
          src={loginBackground}
          alt="Login Background"
          className={styles.loginImage}
          fill
          unoptimized
          priority
        />
      </div>
    </div>
  );
}
