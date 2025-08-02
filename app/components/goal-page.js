'use client';

import { useState } from 'react';

export default function GoalPage({ title }) {
  const [input, setInput] = useState('');
  const [goals, setGoals] = useState([]);

  const addGoal = () => {
    if (input.trim()) {
      setGoals([...goals, { text: input, done: false }]);
      setInput('');
    }
  };

  const toggleGoal = (index) => {
    const updated = goals.map((g, i) =>
      i === index ? { ...g, done: !g.done } : g
    );
    setGoals(updated);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>{title}</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a goal"
          style={{ padding: '0.5rem', width: '60%' }}
        />
        <button onClick={addGoal} style={{ marginLeft: '0.5rem', padding: '0.5rem' }}>
          Add
        </button>
      </div>

      <ul style={{ paddingLeft: 0 }}>
        {goals.map((goal, index) => (
          <li
            key={index}
            onClick={() => toggleGoal(index)}
            style={{
              cursor: 'pointer',
              textDecoration: goal.done ? 'line-through' : 'none',
              background: '#f0f0f0',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              borderRadius: '4px',
              listStyle: 'none',
            }}
          >
            {goal.text}
          </li>
        ))}
      </ul>
    </main>
  );
}
