'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/Home.module.css';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Weekend Goal Setter</div>
      <div className={styles.navLinks}>
        <Link href="/" className={pathname === '/' ? styles.activeLink : ''}>
          Home
        </Link>
        <Link href="/this-week" className={pathname === '/this-week' ? styles.activeLink : ''}>
          This Week
        </Link>
        <Link href="/logout" className={pathname === '/logout' ? styles.activeLink : ''}>
          Logout
        </Link>
      </div>
    </nav>
  );
}
