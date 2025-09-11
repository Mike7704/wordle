"use client";
import { useState, useEffect, useCallback } from "react";
import { getWords, getRandomWord } from "@/lib/words";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";

type GuessStatus = "guessing" | "correct" | "incorrect" | "invalid" | "notaword";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export default function Home() {
  const [word, setWord] = useState<string | null>(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guessStatus, setGuessStatus] = useState<GuessStatus>("guessing");

  const handleKeyPress = useCallback(
    (button: string) => {
      if (!word) return;
      if (guessStatus === "correct" || guessStatus === "incorrect") return; // game over

      if (button === "{enter}") {
        if (currentGuess.length !== WORD_LENGTH) {
          setGuessStatus("invalid");
          return;
        }

        if (!getWords().includes(currentGuess.toLowerCase())) {
          setGuessStatus("notaword");
          return;
        }

        if (currentGuess.toLowerCase() === word) {
          setGuessStatus("correct");
        } else if (guesses.length + 1 === MAX_GUESSES) {
          setGuessStatus("incorrect");
        } else {
          setGuessStatus("guessing");
        }

        setGuesses((prev) => [...prev, currentGuess]);
        setCurrentGuess("");
      } else if (button === "{bksp}") {
        setCurrentGuess((g) => g.slice(0, -1));
      } else if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((g) => g + button.toUpperCase());
      }
    },
    [word, currentGuess, guesses, guessStatus]
  );

  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        handleKeyPress("{enter}");
      } else if (e.key === "Backspace") {
        handleKeyPress("{bksp}");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  function resetGame() {
    setWord(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setGuessStatus("guessing");
  }

  function getCellColour(guess: string, index: number) {
    if (!word) return "border-gray-400";
    const letter = guess[index];
    if (!letter) return "border-gray-400";

    if (word[index].toUpperCase() === letter) {
      return "bg-green-500 text-white border-green-500";
    }
    if (word.toUpperCase().includes(letter)) {
      return "bg-yellow-500 text-white border-yellow-500";
    }
    return "bg-gray-500 text-white border-gray-500";
  }

  function displayMessage() {
    switch (guessStatus) {
      case "correct":
        return <p className="text-green-500 font-semibold text-lg">You guessed the word!</p>;
      case "incorrect":
        return (
          <p className="text-red-500 font-semibold text-lg">
            Game over. The word was: <span className="uppercase">{word}</span>
          </p>
        );
      case "invalid":
        return <p className="text-yellow-500 font-semibold text-lg">Please enter a 5 letter word</p>;
      case "notaword":
        return <p className="text-yellow-500 font-semibold text-lg">Please enter a valid word</p>;
      default:
        return <p className="font-semibold text-lg">Guess a 5 letter word</p>;
    }
  }

  return (
    <main className="flex flex-col justify-evenly items-center gap-6 p-6 min-h-screen">
      <h1 className="text-3xl font-bold">Wordle</h1>

      <div className="flex flex-col gap-2">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
          const guess = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : "");

          return (
            <div key={rowIndex} className="flex gap-2">
              {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                const isSubmitted = rowIndex < guesses.length;
                const cellColour = isSubmitted ? getCellColour(guess, colIndex) : "border-gray-400";

                return (
                  <div
                    key={colIndex}
                    className={`aspect-square w-12 sm:w-14 md:w-16 lg:w-20 border-2 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold uppercase ${cellColour}`}
                  >
                    {guess[colIndex] || ""}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {displayMessage()}

      <OnScreenKeyboard onKeyPress={handleKeyPress} />

      <button
        onClick={resetGame}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer"
      >
        Reset Game
      </button>
    </main>
  );
}
