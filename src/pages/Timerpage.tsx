import React, { useEffect } from 'react'
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import { useState } from "react";
import '../styles/Timerpage.css';
import Circulartimer from './Circulartimer';


const Timerpage = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const increment = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev: number) => Math.min(prev + 1, 24));
  };
  const decrement = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev: number) => Math.max(prev - 1, 0));
  };
  const pad = (num: number) => {
    return num.toString().padStart(2, '0');
  }

  const TotalSeconds = hours * 3600 + minutes * 60 + seconds;
  const startTimer = () => {

    setRunning(true);
    setRemainingSeconds(TotalSeconds);
  }
  useEffect(() => {
    if (remainingSeconds > 0 && running !== false) {
      const interval = setInterval(() => {
        setRemainingSeconds(prev => prev - 1)
      }, 1000);

      return () => clearInterval(interval);
    } else {
      return;
    }
  }, [remainingSeconds, running]);

  return (
    <div className="timer-wrapper">
      <div className="timer-circle">
        <Circulartimer totalSeconds={TotalSeconds} remainingSeconds={remainingSeconds}>
        </Circulartimer>
      </div>
    <div className="timer-settings">
      <div className='timer-controls'>

        <div className="time-block">
          <h6>Hours</h6>
          <button className='increment' onClick={() => increment(setHours)}><IoChevronUp />
          </button>
          <div className='time-box'>{pad(hours)}</div>
          <button className='decrement' onClick={() => decrement(setHours)}><IoChevronDown />
          </button>
        </div>
        <div className="time-separator">:</div>
        <div className="time-block">
          <h6>Minutes</h6>
          <button className='increment' onClick={() => increment(setMinutes)}><IoChevronUp />
          </button>
          <div className='time-box'>{pad(minutes)}</div>
          <button className='decrement' onClick={() => decrement(setMinutes)}><IoChevronDown />
          </button>
        </div>
        <div className="time-separator">:</div>
        <div className="time-block">
          <h6>Seconds</h6>
          <button className='increment' onClick={() => increment(setSeconds)}><IoChevronUp />
          </button>
          <div className='time-box'>{pad(seconds)}</div>
          <button className='decrement' onClick={() => decrement(setSeconds)}><IoChevronDown />
          </button>
        </div>


      </div>
      <button className='start-btn' onClick={startTimer}>start</button>
    </div>
  </div>  
  );
}

export default Timerpage
