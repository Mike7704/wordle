"use client";
import { useState, useEffect } from "react";
import { getRandomWord } from "@/lib/words";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";

export default function Home() {
  const [solution, setSolution] = useState<string | null>(null);
  const [currentGuess, setCurrentGuess] = useState("");

  useEffect(() => {
    setSolution(getRandomWord());
  }, []);

  function handleKeyPress(button: string) {
    if (button === "{enter}") {
      if (currentGuess.length !== 5) {
        console.log("Not enough letters");
        return;
      }

      if (currentGuess.toLowerCase() === solution) {
        console.log("Correct");
        setCurrentGuess("");
      } else {
        console.log("Incorrect");
        setCurrentGuess("");
      }
    } else if (button === "{bksp}") {
      setCurrentGuess((g) => g.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess((g) => g + button.toUpperCase());
    }
  }

  return (
    <main className="flex flex-col items-center gap-5">
      <h1 className="text-3xl font-bold">Wordle</h1>
      <p>Current guess: {currentGuess}</p>
      <OnScreenKeyboard onKeyPress={handleKeyPress} />
    </main>
  );
}
