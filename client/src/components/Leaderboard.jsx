import React from 'react';

const Leaderboard = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="leaderboard">
      <h3>Global Top 10</h3>
      <ul>
        {data.map((entry, index) => (
          <li key={index}>
            <span>{index + 1}. {entry.name}</span>
            <span>{Math.floor(entry.score)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
