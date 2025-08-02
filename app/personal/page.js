'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/GoalPage.module.css';

export default function GoalPage({ title, category }) {
  const [goals, setGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(null);

  const initialDefaultGoals = [
    ' Do a 15-minute nature walk and write what you noticed',
    ' Have a 2-hour digital detox — no screens at all',
    ' Create something: sketch, paint, or build — just for fun',
    ' Listen to a new podcast and note 1 takeaway',
    ' Try 10 minutes of mindful breathing or meditation',
    ' Write 3 things you’re grateful for this week',
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

  // ✅ Add Suggested Goal to selectedGoals (NOT DB)
  const handleSelectDefault = (text, index) => {
    if (isDuplicate(text, [...goals, ...selectedGoals])) return;

    const newGoal = { text, done: false };
    setSelectedGoals(prev => [...prev, newGoal]);

    setJustAdded(index);
    setTimeout(() => setJustAdded(null), 2000);
  };

  // ✅ Add new goal + all selectedGoals to DB
  const handleAddGoal = async () => {
    if (!newGoal.trim() && selectedGoals.length === 0) return;

    const goalsToSave = [...selectedGoals];

    // Include new input goal if typed
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
            body: JSON.stringify({
              text: goal.text,
              done: goal.done,
              category,
            }),
          }).then(res => res.json())
        )
      );

      setGoals(prev => [...prev, ...responses]);
      setSelectedGoals([]); // clear temporary
      setNewGoal('');
    } catch (err) {
      console.error('Error saving goals:', err);
      alert('Some goals could not be saved.');
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
    const combinedGoals = [...goals, ...selectedGoals];
    const updated = [...combinedGoals];
    updated[index].done = !updated[index].done;

    if (index < goals.length) {
      // DB-stored goals
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
      // Local-only selected goals
      const newSelected = [...selectedGoals];
      newSelected[index - goals.length].done = updated[index].done;
      setSelectedGoals(newSelected);
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
                  onClick={() => handleSelectDefault(text, idx)}
                  disabled={alreadyAdded}
                >
                   {alreadyAdded ? '✅' : '➕'}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* All Goals: Stored + Selected */}
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

      {/* Input and Action Buttons */}
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
