'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from '../styles/Home.module.css'; // adjust if needed

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) return <p> Checking authentication...</p>;

  return (
    <main className={styles.main}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Weekend Goal Setter</div>
        <div className={styles.navLinks}>
          <Link
            href="/home"
            className={pathname === '/home' ? styles.activeLink : ''}
          >
            Home
          </Link>
          <Link
            href="/this-week"
            className={pathname === '/this-week' ? styles.activeLink : ''}
          >
            This Week
          </Link>
          <Link href="/login" 
          className={pathname === '/login' ? styles.logoutLink: ''}>
            Logout
          </Link>
        </div>
      </nav>

      <section>
        <h2 className={styles.sectionTitle}> Select Your Weekend Portal:</h2>
        <ul className={styles.goalList}>
          <li className={styles.card}>
            <Link href="/personal" className={styles.link}>
               <strong>Personal Goals</strong><br />
              <span className={styles.description}>
                Declutter your space. Recharge your spirit.
              </span>
            </Link>
          </li>
          <li className={styles.card}>
            <Link href="/learning" className={styles.link}>
               <strong>Learning Goals</strong><br />
              <span className={styles.description}>
                Feed your curiosity. Build your future mind.
              </span>
            </Link>
          </li>
          <li className={styles.card}>
            <Link href="/health" className={styles.link}>
               <strong>Health Goals</strong><br />
              <span className={styles.description}>
                Move. Stretch. Rest. Heal from the inside.
              </span>
            </Link>
          </li>
          <li className={styles.card}>
            <Link href="/fun" className={styles.link}>
               <strong>Fun & Relaxation</strong><br />
              <span className={styles.description}>
                Laugh, breathe, watch clouds, make art.
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
