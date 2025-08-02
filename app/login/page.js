'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (res.ok) {
      router.push('/home');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>Login</h1>
      <input
        className={styles.authInput}
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className={styles.authInput}
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className={styles.authButton} onClick={handleLogin}>Login</button>
      <p className={styles.authLink}>
        Don't have an account? <a href="/signup">Signup</a>
      </p>
    </div>
  );
}
