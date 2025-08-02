'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Auth.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      alert('Signup failed');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>Signup</h1>
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
      <button className={styles.authButton} onClick={handleSignup}>Signup</button>
    </div>
  );
}
