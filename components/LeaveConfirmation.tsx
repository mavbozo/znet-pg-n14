// components/LeaveConfirmation.tsx
import React from "react";

interface LeaveConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const LeaveConfirmation: React.FC<LeaveConfirmationProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div>
      <h2>Are you sure you want to leave?</h2>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
};
