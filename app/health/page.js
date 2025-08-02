'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/GoalPage.module.css';

export default function GoalPage({ title, category }) {
  const [goals, setGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(true);

  const initialDefaultGoals = [
    ' Eat a healthy, home-cooked meal today',
    ' Walk at least 5,000 steps',
    ' Do a 10-minute stretching or yoga session',
    ' Drink at least 8 glasses of water',
    ' Sleep for at least 7 hours tonight',
    ' Take a 5-minute mental break every hour',
    ' Avoid junk food and sugary drinks today',
    ' Do a quick 15-minute workout',
    ' Schedule or check a health appointment',
  ];

  const [suggestedGoals, setSuggestedGoals] = useState(initialDefaultGoals);

  const isDuplicate = (text, list) => list.some(goal => goal.text === text);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch(`/api/goals?category=${category}`);
        const data = await res.json();
        setGoals(data);
      } catch (err) {
        console.error('Failed to fetch goals', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [category]);

  // ➕ Add suggested goal to temporary local list only
  const handleSelectDefault = (text) => {
    if (isDuplicate(text, [...goals, ...selectedGoals])) return;
    const selected = { text, done: false };
    setSelectedGoals(prev => [...prev, selected]);
  };

  // ✅ Save input + selected suggested goals to DB
  const handleAddGoal = async () => {
    if (!newGoal.trim() && selectedGoals.length === 0) return;

    const goalsToSave = [...selectedGoals];

    if (newGoal.trim()) {
      const emojiPrefixed = newGoal.match(/^[\p{Emoji}]/u)
        ? newGoal
        : `✨ ${newGoal}`;
      goalsToSave.push({ text: emojiPrefixed, done: false });
    }

    try {
      const responses = await Promise.all(
        goalsToSave.map(goal =>
          fetch('/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...goal, category }),
          }).then(res => res.json())
        )
      );
      setGoals(prev => [...prev, ...responses]);
      setSelectedGoals([]);
      setNewGoal('');
    } catch (err) {
      console.error('Error saving goals:', err);
    }
  };

  const handleAddToSuggested = () => {
    if (!newGoal.trim()) return;
    const emojiPrefixed = newGoal.match(/^[\p{Emoji}]/u)
      ? newGoal
      : `✨ ${newGoal}`;
    if (!suggestedGoals.includes(emojiPrefixed)) {
      setSuggestedGoals(prev => [...prev, emojiPrefixed]);
    }
    setNewGoal('');
  };

  const toggleGoal = (index) => {
    const all = [...goals, ...selectedGoals];
    const updated = [...all];
    updated[index].done = !updated[index].done;

    if (index < goals.length) {
      const id = goals[index]._id;
      if (id) {
        fetch(`/api/goals/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: updated[index].done }),
        }).catch(console.error);
      }
      const newGoals = [...goals];
      newGoals[index].done = updated[index].done;
      setGoals(newGoals);
    } else {
      const newSelected = [...selectedGoals];
      newSelected[index - goals.length].done = updated[index].done;
      setSelectedGoals(newSelected);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{title}</h1>

      {/* ✅ Suggested Goals Section */}
      <div className={styles.defaultSection}>
        <h3 className={styles.defaultTitle}>Select from Suggested Goals</h3>
        <ul className={styles.defaultList}>
          {suggestedGoals.map((text, idx) => {
            const alreadyAdded = isDuplicate(text, [...goals, ...selectedGoals]);
            return (
              <li key={idx} className={styles.defaultListItem}>
                <span className={styles.defaultGoalText}>{text}</span>
                <button
                  className={styles.defaultAddButton}
                  onClick={() => handleSelectDefault(text)}
                  disabled={alreadyAdded}
                >
                  {alreadyAdded ? '✅' : '➕'}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ✅ Display Goals (Saved + Selected) */}
      {loading ? (
        <p>Loading goals...</p>
      ) : goals.length + selectedGoals.length === 0 ? (
        <p style={{ color: 'black' }}>
          No goals yet. Add one below or select from defaults above.
        </p>
      ) : (
        <ul className={styles.goalList}>
          {[...goals, ...selectedGoals].map((goal, index) => (
            <li
              key={goal._id || goal.text || index}
              className={`${styles.goalItem} ${goal.done ? styles.done : ''}`}
              onClick={() => toggleGoal(index)}
            >
              <span className={styles.statusIcon}>
                {goal.done ? '✅' : '🔲'}
              </span>
              <span className={styles.goalText}>{goal.text}</span>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Input and Buttons */}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Enter a new goal..."
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleAddToSuggested} className={styles.buttonSecondary}>
          ➕ Add to Suggested
        </button>
        <button onClick={handleAddGoal} className={styles.button}>
          ➕ Add Goal
        </button>
      </div>
    </div>
  );
}
