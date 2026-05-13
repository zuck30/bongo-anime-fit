
import React from 'react';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import { questions } from '../data/questions';

interface QuizProps {
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  currentQuestionData: typeof questions[0];
  answersCount: number;
}

const Quiz: React.FC<QuizProps> = ({ 
  currentQuestion, 
  totalQuestions, 
  onAnswer, 
  currentQuestionData,
  answersCount 
}) => {
  const progress = ((answersCount) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="block-card max-w-2xl w-full animate-fall">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-tetris-blue" />
              <span className="font-pixel text-xs text-tetris-yellow">
                {currentQuestion + 1}/{totalQuestions}
              </span>
            </div>
          </div>
          
          <div className="h-4 bg-tetris-dark border-2 border-tetris-blue relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-tetris-blue to-tetris-pink transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="absolute h-4 w-1 bg-tetris-yellow opacity-50"
              style={{ left: `${(i + 1) * 20}%`, top: 'auto' }}
            />
          ))}
        </div>
        
        <h2 className="text-xl md:text-2xl font-pixel text-tetris-blue mb-8 leading-relaxed">
          {currentQuestionData.text}
        </h2>
        
        <div className="space-y-3">
          {currentQuestionData.answers.map((answer, idx) => (
            <button
              key={idx}
              onClick={() => onAnswer(answer.text)}
              className="w-full text-left p-4 border-2 border-tetris-blue bg-tetris-dark/50 
                       hover:bg-tetris-blue hover:text-tetris-dark transition-all duration-300
                       group flex justify-between items-center"
            >
              <span className="font-retro text-lg">{answer.text}</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;