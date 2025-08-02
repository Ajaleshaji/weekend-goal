'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/GoalPage.module.css';

export default function ThisWeekPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch('/api/goals');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      setGoals((prev) => prev.filter((goal) => goal._id !== id));
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.pageTitle}> This Week's Goals</h1>

      {loading ? (
        <p>Loading goals...</p>
      ) : goals.length === 0 ? (
        <p>No goals saved yet. Add some from your goal categories!</p>
      ) : (
        <ul className={styles.goalList}>
          {goals.map((goal) => (
            <li
              key={goal._id}
              className={`${styles.goalItem} ${goal.done ? styles.done : ''}`}
            >
              <span>
                {goal.done ? '✅' : '🔲'} {goal.text}
              </span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(goal._id)}
                title="Delete"
              >
                −
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
