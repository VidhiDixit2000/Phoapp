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
  const radius = 90;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = totalSeconds>0 ? remainingSeconds/totalSeconds:0;

  // how much of the circle to hide
  const strokeDashoffset =
    circumference - progress * circumference;

    const formattime=(remainingSeconds:number)=>{
      const hours=Math.floor(remainingSeconds/3600);
      const minutes=Math.floor((remainingSeconds%3600)/60);
      const seconds=remainingSeconds%60;
      return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }
  return (
    <div>
      <svg width="180" height="180">
        {/* outer circle */}
<circle cx={radius} cy={radius} r={normalizedRadius} stroke="#193927" strokeWidth={stroke} fill="transparent"/>
        {/* progress circle */}
<circle cx={radius} cy={radius} r={normalizedRadius} stroke="#bfbd3c" strokeWidth={stroke} fill="transparent" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeDashoffset}/>
  

      </svg>
      <div className="timer-display">{formattime(remainingSeconds)}</div>
    </div>
    
  )
}

export default Circulartimer
