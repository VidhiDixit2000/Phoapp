import React from 'react';
import '../styles/Timerpage.css';

interface Props {
  totalSeconds: number;
  remainingSeconds: number;
}

const Circulartimer: React.FC<Props> = ({
  totalSeconds,
  remainingSeconds,
}) => {
  // circle size config
  // stroke bumped 8 -> 14 for a chunkier, more readable ring.
  // normalizedRadius shrinks as stroke grows (radius - stroke * 2), which
  // keeps the outer edge inside the 180x180 viewBox automatically.
  const radius = 90;
  const stroke = 14;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;

  // how much of the circle to hide
  const strokeDashoffset = circumference - progress * circumference;

  const formattime = (remainingSeconds: number) => {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const label = formattime(remainingSeconds);

  return (
    // viewBox instead of fixed width/height, so the SVG scales with whatever
    // size .timer-circle gives it rather than being locked to 180px.
    <svg
      viewBox="0 0 180 180"
      className="circular-timer"
      role="img"
      aria-label={`Time remaining: ${label}`}
    >
      {/* track — muted blue-grey. The old #193927 dark green was almost
          indistinguishable from the navy card behind it, so the drained
          portion of the ring read as empty space. */}
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        stroke="#2e3a6b"
        strokeWidth={stroke}
        fill="transparent"
      />

      {/* progress — rotate(-90) moves the start point from 3 o'clock to
          12 o'clock. SVG measures angles from the positive x-axis, so
          without this the arc drains from the right-hand edge.
          The 90 90 are the rotation origin (the circle's centre). */}
      <circle
        className="circular-timer-progress"
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        stroke="#3ddc97"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="transparent"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${radius} ${radius})`}
      />

      {/* The time lives INSIDE the svg. textAnchor + dominantBaseline centre
          it on the circle's centre point by construction, so it can't drift
          out of alignment when the layout around it changes. */}
      <text
        x={radius}
        y={radius}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize="24"
        fontWeight="700"
        fontFamily="inherit"
      >
        {label}
      </text>
    </svg>
  );
};

export default Circulartimer;