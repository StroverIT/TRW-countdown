import React from "react";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = "",
}) => {
  const percentage = Math.round(progress * 100);

  return (
    <div
      className={`w-full ${className}`}
      aria-label="Progress"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    >
      <div className="progress-bar-modern" aria-hidden>
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <div className="mt-2 text-xs text-white text-opacity-80 text-right">
        {percentage}%
      </div>
    </div>
  );
};
