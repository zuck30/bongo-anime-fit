import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import TetrisBackground from './components/TetrisBackground';
import ShareCard from './components/ShareCard';
import PhotoUpload from './components/PhotoUpload';
import CombinedShareCard from './components/CombinedShareCard';
import { generateQuestions, getCharacter, Question, CharacterResult } from './services/groq';
import { Loader2 } from 'lucide-react';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<CharacterResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);

  useEffect(() => {
    loadQuestions();
    trackUser();
  }, []);

  const trackUser = () => {
    const hasPlayed = localStorage.getItem('hasPlayed');
    if (!hasPlayed) {
      localStorage.setItem('hasPlayed', 'true');
      const count = parseInt(localStorage.getItem('totalPlayers') || '0') + 1;
      localStorage.setItem('totalPlayers', count.toString());
      setTotalPlayers(count);
    } else {
      const count = parseInt(localStorage.getItem('totalPlayers') || '1');
      setTotalPlayers(count);
    }
  };

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = await generateQuestions();
      setQuestions(q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleComplete = async () => {
    setGenerating(true);
    setError(null);
    try {
      const characterResult = await getCharacter(answers);
      setResult(characterResult);
      setShowPhotoUpload(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find character");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePhotoSelected = (photoUrl: string) => {
    setUserPhoto(photoUrl);
    setShowPhotoUpload(false);
    setShowResult(true);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setIsComplete(false);
    setShowResult(false);
    setResult(null);
    setError(null);
    setShowPhotoUpload(false);
    setUserPhoto(null);
    loadQuestions();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <TetrisBackground />
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#00f3ff] animate-spin mx-auto mb-4" />
          <p className="text-[#ffcc00]" style={{ fontFamily: 'monospace' }}>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <TetrisBackground />
        <div className="bg-red-900/80 border-2 border-red-500 p-6 text-center max-w-md w-full">
          <h2 className="text-xl text-red-300 mb-4" style={{ fontFamily: 'monospace' }}>Error</h2>
          <p className="text-white mb-4" style={{ fontFamily: 'monospace' }}>{error}</p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-red-700 border border-red-400 text-white hover:bg-red-600"
            style={{ fontFamily: 'monospace' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <TetrisBackground />
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#00f3ff] animate-spin mx-auto mb-4" />
          <p className="text-[#ffcc00]" style={{ fontFamily: 'monospace' }}>AI is analyzing your answers...</p>
        </div>
      </div>
    );
  }

  if (showPhotoUpload && result) {
    return (
      <>
        <TetrisBackground />
        <PhotoUpload
          onPhotoSelected={handlePhotoSelected}
          onClose={() => {
            setShowPhotoUpload(false);
            setShowResult(true);
          }}
        />
      </>
    );
  }

  if (showResult && result && userPhoto) {
    return (
      <>
        <Confetti />
        <TetrisBackground />
        <CombinedShareCard
          character={result.character}
          anime={result.anime}
          funnyLine={result.funny_line}
          userPhoto={userPhoto}
          onClose={resetGame}
        />
      </>
    );
  }

  if (showResult && result && !userPhoto) {
    return (
      <>
        <Confetti />
        <TetrisBackground />
        <ShareCard
          character={result.character}
          anime={result.anime}
          description={result.description}
          funnyLine={result.funny_line}
          traits={result.traits}
          onClose={resetGame}
        />
      </>
    );
  }

  if (!isComplete && questions.length > 0) {
    return (
      <>
        <TetrisBackground />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-[#1a0b2e]/95 border-2 border-[#00f3ff] p-6 max-w-2xl w-full">
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                <span className="text-xs text-[#ffcc00]" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  Question {currentIndex + 1}/{questions.length}
                </span>
                <span className="text-xs text-[#ffcc00]" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  🎮 {totalPlayers} players
                </span>
              </div>
              <div className="h-4 bg-[#1a0b2e] border-2 border-[#00f3ff] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00f3ff] to-[#ff00e0] transition-all duration-500"
                  style={{ width: `${((answers.length) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            <h2 className="text-xl md:text-2xl mb-8 text-[#00f3ff]" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
              {questions[currentIndex].text}
            </h2>
            
            <div className="space-y-3">
              {questions[currentIndex].answers.map((answer, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(answer)}
                  className="w-full text-left p-4 border-2 border-[#00f3ff] bg-[#1a0b2e]/50 
                           hover:bg-[#00f3ff] hover:text-[#1a0b2e] transition-all duration-300
                           group flex justify-between items-center text-lg"
                  style={{ fontFamily: 'monospace' }}
                >
                  <span>{answer}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TetrisBackground />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#1a0b2e]/95 border-2 border-[#00f3ff] p-6 text-center max-w-md w-full">
          <h2 className="text-2xl text-[#00f3ff] mb-4" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>Done!</h2>
          <p className="mb-8" style={{ fontFamily: 'monospace' }}>You answered all {answers.length} questions.</p>
          <button
            onClick={handleComplete}
            className="w-full p-3 bg-[#4a0e6b] border-2 border-[#00f3ff] text-sm hover:bg-[#00f3ff] hover:text-[#1a0b2e] transition-all mb-3"
            style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
          >
            Find My Character
          </button>
          <button
            onClick={resetGame}
            className="w-full p-3 border-2 border-[#ff00e0] text-sm text-[#ff00e0] hover:bg-[#ff00e0] hover:text-[#1a0b2e] transition-all"
            style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
          >
            Play Again
          </button>
        </div>
      </div>
    </>
  );
}

export default App;