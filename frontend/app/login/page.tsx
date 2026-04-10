"use client";

import React, { useState, Suspense } from 'react';
import styles from './login.module.css';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import loginBackground from '@/public/loginbackground.png';
import loginIcons from '@/public/loginicons.png';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div style={{ color: '#FF5C35', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
      {registered && (
        <div style={{ color: '#10b981', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
          Registration successful! Please log in.
        </div>
      )}

      <form className={styles.form} onSubmit={handleLogin}>
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
              placeholder="Enter your password"
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

        <div className={styles.options}>
          <label className={styles.rememberMe}>
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="#" className={styles.forgotPassword}>Forgot password?</a>
        </div>

        <button type="submit" className={styles.loginBtn} disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div className={styles.footer}>
        Don't have an account? <Link href="/register">Sign up</Link>
      </div>
    </>
  );
}

export default function LoginPage() {
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
            <h1>Login</h1>
            <p>Enter your details to continue</p>
          </div>

          <Suspense fallback={<div style={{ color: '#10b981', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>Loading...</div>}>
            <LoginForm />
          </Suspense>
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
          sizes="(max-width: 1024px) 0vw, 50vw"
        />
      </div>
    </div>
  );
}