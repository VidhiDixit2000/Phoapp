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

  // Each field needs its own ceiling. Previously all three were capped at 24,
  // so minutes and seconds stopped there instead of at 59.
  const increment = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    max: number
  ) => {
    setter((prev: number) => Math.min(prev + 1, max));
  };
  const decrement = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev: number) => Math.max(prev - 1, 0));
  };
  const pad = (num: number) => {
    return num.toString().padStart(2, '0');
  }

  const TotalSeconds = hours * 3600 + minutes * 60 + seconds;

  // A timer is paused (rather than idle) when it has time left but isn't
  // ticking. That distinction decides whether start resumes or restarts.
  const isPaused = !running && remainingSeconds > 0;

  const startTimer = () => {
    // Resuming: leave remainingSeconds alone and just start ticking again.
    if (isPaused) {
      setRunning(true);
      return;
    }

    // Fresh start with nothing set — previously this returned silently, so
    // clicking start looked like a broken button.
    if (TotalSeconds <= 0) {
      alert("Set a time first");
      return;
    }

    setRunning(true);
    setRemainingSeconds(TotalSeconds);
  }

  // Stops the interval without clearing remainingSeconds. The effect's
  // cleanup does the actual clearInterval when `running` flips to false.
  const pauseTimer = () => {
    setRunning(false);
  };

  const resetTimer = () => {
    setRunning(false);
    setRemainingSeconds(0);
  };

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
          <button className='increment' onClick={() => increment(setHours, 23)}><IoChevronUp />
          </button>
          <div className='time-box'>{pad(hours)}</div>
          <button className='decrement' onClick={() => decrement(setHours)}><IoChevronDown />
          </button>
        </div>
        <div className="time-separator">:</div>
        <div className="time-block">
          <h6>Minutes</h6>
          <button className='increment' onClick={() => increment(setMinutes, 59)}><IoChevronUp />
          </button>
          <div className='time-box'>{pad(minutes)}</div>
          <button className='decrement' onClick={() => decrement(setMinutes)}><IoChevronDown />
          </button>
        </div>
        <div className="time-separator">:</div>
        <div className="time-block">
          <h6>Seconds</h6>
          <button className='increment' onClick={() => increment(setSeconds, 59)}><IoChevronUp />
          </button>
          <div className='time-box'>{pad(seconds)}</div>
          <button className='decrement' onClick={() => decrement(setSeconds)}><IoChevronDown />
          </button>
        </div>


      </div>
      <div className='timer-actions'>
        <button className='start-btn' onClick={startTimer}>
          {isPaused ? 'resume' : 'start'}
        </button>

        {/* Pause only makes sense while the clock is actually running, so it
            stays disabled otherwise rather than appearing and disappearing —
            a button that vanishes makes the row jump around. */}
        <button
          className='pause-btn'
          onClick={pauseTimer}
          disabled={!running}
        >
          pause
        </button>

        <button className='reset-btn' onClick={resetTimer}>reset</button>
      </div>
    </div>
  </div>  
  );
}

export default Timerpage