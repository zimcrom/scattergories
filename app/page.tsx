"use client"

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [randomLetter, setRandomLetter] = useState(" ");
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(1); // Default input time in minutes
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const audioRef = useRef<HTMLAudioElement>(null); // Explicitly typed useRef for audio element

  function getLetter() {
    return letters[Math.floor(Math.random() * 26)];
  }

  function generateLetter() {
    setRandomLetter(getLetter());
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputMinutes(parseInt(event.target.value, 10));
  }

  function startTimer() {
    const parsedMinutes = parseInt(inputMinutes.toString(), 10);
    if (!isNaN(parsedMinutes) && parsedMinutes > 0) {
      setIsTimerRunning(true);
      setTime(parsedMinutes * 60); // Convert minutes to seconds
    } else {
      alert("Please enter a valid number of minutes greater than 0");
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (audioRef.current) {
        audioRef.current.play(); // Play the sound when the timer reaches zero
      }
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, time]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <main className="flex flex-col justify-center items-center w-full h-screen text-center bg-blue text-offWhite">
      <section className="flex flex-col pb-16">
        <h1 className="text-6xl pb-4">Scattergories</h1>
        <p className="text-xl">Your letter is:</p>
        <p className="text-4xl">{randomLetter}</p>
        <button
          className="p-2 mt-4 border-offWhite border-2 rounded-lg hover:border-darkestBlue hover:text-darkestBlue hover:bg-offWhite"
          onClick={generateLetter}
        >
          Generate letter
        </button>
      </section>
      <section className="flex flex-col">
        <h2 className="text-6xl pb-4">Timer</h2>
        <input
          type="number"
          value={inputMinutes}
          onChange={handleInputChange}
          className="text-2xl p-2 border-2 rounded-lg text-center mb-4 text-blue"
          min="1"
        />
        <p className="text-4xl">{formatTime(time)}</p>
        <button
          className="p-2 mt-4 border-offWhite border-2 rounded-lg hover:border-darkestBlue hover:text-darkestBlue hover:bg-offWhite"
          onClick={startTimer}
        >
          Start Timer
        </button>
        <audio ref={audioRef} src="/sounds/ding-126626.mp3" />
      </section>
    </main>
  );
}

