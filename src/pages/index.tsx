import React, { useState } from "react";
import Xarrow from "react-xarrows";

export default function Home() {
  const words = new Map([
    ["forest", "forêt"],
    ["sibling", "frère et sœur"],
    ["cereal", "céréale"],
    ["desk", "bureau"],
    ["camel", "chameau"],
    ["butter", "beurre"],
    ["bicycle", "vélo"],
    ["railroad", "chemin de fer"],
    ["folder", "dossier"],
    ["weekly", "hebdomadaire"],
    ["hungry", "faim"],
    ["limestone", "calcaire"],
  ]);

  const [shuffledWords, setShuffledWords] = useState(Array.from(words));
  const [selectedEnglishWord, setSelectedEnglishWord] = useState("");
  const [selectedFrenchWord, setSelectedFrenchWord] = useState("");
  const [selectedWords, setSelectedWords] = useState(new Map());
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  // Fisher-Yates algorithm, might be overkill for this use case
  // can simply use array.sort() method
  function shuffleWords() {
    const shuffledWords = Array.from(words);
    for (let i = shuffledWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledWords[i];
      shuffledWords[i] = shuffledWords[j];
      shuffledWords[j] = temp;
    }
    return shuffledWords;
  }

  function handleEnglishWordClick(englishWord: React.SetStateAction<string>) {
    if (!gameStarted) return;

    setSelectedEnglishWord(selectedEnglishWord === englishWord ? "" : englishWord);

    if (selectedFrenchWord !== "") addSelectedWordPair(englishWord, selectedFrenchWord);
  }

  function handleFrenchWordClick(frenchWord: React.SetStateAction<string>) {
    if (!gameStarted) return;

    setSelectedFrenchWord(selectedFrenchWord === frenchWord ? "" : frenchWord);

    if (selectedEnglishWord !== "") addSelectedWordPair(selectedEnglishWord, frenchWord);
  }

  function addSelectedWordPair(englishWord: React.SetStateAction<string>, frenchWord: React.SetStateAction<string>) {
    selectedWords.set(englishWord, frenchWord);
    setSelectedEnglishWord("");
    setSelectedFrenchWord("");
  }

  function handleStartGameClick() {
    setGameStarted(true);
    setShowResults(false);
    setGameScore(0);
    setSelectedWords(new Map());
    setShuffledWords(shuffleWords());
  }

  function handleGradeClick() {
    setGameStarted(false);
    calculateScore();
    setShowResults(true);
  }

  function calculateScore() {
    if (selectedWords.size === 0) return 0;

    const sameEntries = Array.from(selectedWords).filter(
      ([english, french]) => words.get(english) === french
    );
    const percentage = Number(((sameEntries.length / words.size) * 100).toFixed(2));
    setGameScore(percentage);
  }

  return (
    <main className="main-screen">
      <div>
        <div className="header">
          <h1 className="title">Word Memory Game</h1>
          <button
            onClick={gameStarted ? handleGradeClick : handleStartGameClick}
            className="start-button">
            {gameStarted ? "GRADE" : "GO!"}
          </button>
        </div>
        <p> 
          Instructions: <br />
          1. Click on the &quot;GO!&quot; button to start the game. <br />
          2. Click on a word from either one of the list, then click another word from the other list to match them. <br />
          3. Click on the &quot;GRADE&quot; button to see your score. <br />
        </p>
        <div className="tables-container">
          <table className="excel-table">
            <thead>
              <tr>
                <th>English Words</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(words).map(([english]) => (
                <tr key={english}>
                  <td
                    id={english}
                    className={
                      selectedEnglishWord === english ? "selected" : ""
                    }>
                    <button onClick={() => handleEnglishWordClick(english)}>
                      {english}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-space"></div>
          <table className="excel-table">
            <thead>
              <tr>
                <th>French Words</th>
              </tr>
            </thead>
            <tbody>
              {shuffledWords.map(([, french]) => (
                <tr key={french}>
                  <td
                    id={french}
                    className={selectedFrenchWord === french ? "selected" : ""}>
                    <button onClick={() => handleFrenchWordClick(french)}>
                      {french}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {Array.from(selectedWords).map(([english, french]) => (
            <Xarrow
              key={english}
              start={english}
              end={french}
              showTail={true}
            />
          ))}
        </div>
        {showResults && (
          <div>
            <p>
              You got {gameScore}%.
              {gameScore >= 60 ? "🎉 Good job!" : "😔 Keep practicing!"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
