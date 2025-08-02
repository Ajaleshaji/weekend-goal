'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/GoalPage.module.css';

export default function GoalPage({ title, category }) {
  const [goals, setGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(true);

  const initialDefaultGoals = [
    ' Watch your favorite movie or series episode',
    ' Play a game you enjoy for 30 minutes',
    ' Listen to your favorite playlist and relax',
    ' Read a book purely for fun',
    ' Take a long relaxing bath or shower',
    ' Call or hang out with a friend just to chat',
    ' Watch the sunrise or sunset peacefully',
    ' Do some painting, doodling, or crafting',
    ' Spend 10 minutes in nature doing nothing',
    ' Dance to a song like no one’s watching',
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

  // ✅ Add selected default to temporary list (not DB)
  const handleSelectDefault = (text) => {
    if (isDuplicate(text, [...goals, ...selectedGoals])) return;
    setSelectedGoals(prev => [...prev, { text, done: false }]);
  };

  // ✅ Save both typed goal + selectedGoals into DB
  const handleAddGoal = async () => {
    if (!newGoal.trim() && selectedGoals.length === 0) return;

    const toSave = [...selectedGoals];

    if (newGoal.trim()) {
      const emojiPrefixed = newGoal.match(/^[\p{Emoji}]/u)
        ? newGoal
        : `✨ ${newGoal}`;
      toSave.push({ text: emojiPrefixed, done: false });
    }

    try {
      const savedGoals = await Promise.all(
        toSave.map(goal =>
          fetch('/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...goal, category }),
          }).then(res => res.json())
        )
      );

      setGoals(prev => [...prev, ...savedGoals]);
      setSelectedGoals([]);
      setNewGoal('');
    } catch (err) {
      console.error('Error saving goal(s):', err);
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
      const updatedGoals = [...goals];
      updatedGoals[index].done = updated[index].done;
      setGoals(updatedGoals);

      fetch(`/api/goals/${goals[index]._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: updated[index].done }),
      }).catch(console.error);
    } else {
      const localIndex = index - goals.length;
      const updatedSelected = [...selectedGoals];
      updatedSelected[localIndex].done = updated[index].done;
      setSelectedGoals(updatedSelected);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{title}</h1>

      {/* Suggested Goals */}
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

      {/* Goal List */}
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

      {/* Input and Buttons */}
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
