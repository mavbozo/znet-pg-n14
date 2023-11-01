// components/Result.tsx
import React from "react";

interface ResultProps {
  score: number;
  onNewPractice: () => void;
}

export const Result: React.FC<ResultProps> = ({ score, onNewPractice }) => {
  return (
    <div>
      <h2>Your Score: {score}</h2>
      <button onClick={onNewPractice}>Start New Practice</button>
    </div>
  );
};
