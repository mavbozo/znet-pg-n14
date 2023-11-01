// components/Evaluation.tsx
import React from "react";

interface EvaluationProps {
  correctAnswer: string;
  answerSubmitted: string;
  //   onNextQuestion: () => void;
}

export const Evaluation: React.FC<EvaluationProps> = ({
  correctAnswer,
  answerSubmitted,
}) => {
  return (
    <div>
      <h2>Your answer: {answerSubmitted}</h2>
      <h2>Correct answer: {correctAnswer}</h2>
    </div>
  );
};
