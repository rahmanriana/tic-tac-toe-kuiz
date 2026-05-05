import React, { useState, useEffect } from 'react';

export const QuizModal = ({
  isOpen,
  question,
  onSubmitAnswer,
  feedback,
  round,
  onClose
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'mudah': return 'bg-green-100 text-green-800';
      case 'menengah': return 'bg-yellow-100 text-yellow-800';
      case 'sulit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch(difficulty) {
      case 'mudah': return 'MUDAH (Easy)';
      case 'menengah': return 'MENENGAH (Medium)';
      case 'sulit': return 'SULIT (Hard)';
      default: return 'MUDAH (Easy)';
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (feedback) {
      setIsAnswered(true);
    }
  }, [feedback]);

  const handleAnswerClick = (index) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && !isAnswered) {
      onSubmitAnswer(selectedAnswer);
    }
  };

  if (!isOpen || !question) return null;

  const isCorrect = feedback?.type === 'correct';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <div className="mb-6">
          <div className={`inline-block px-3 py-1 rounded-lg font-bold mb-3 ${getDifficultyColor(question.difficulty)}`}>
            {getDifficultyLabel(question.difficulty)}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {question.question}
          </h2>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={isAnswered}
              className={`
                w-full p-4 text-left rounded-lg font-semibold transition-all duration-200
                ${selectedAnswer === index
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : feedback && index === question.correctAnswer
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }
                ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="inline-block w-8 h-8 rounded-full bg-opacity-30 mr-2 text-center">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`
            mb-6 p-4 rounded-lg text-center font-semibold
            ${isCorrect
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }
          `}>
            {isCorrect ? (
              <div>
                <div className="text-2xl mb-2">✅ Correct!</div>
                <div>+{feedback.points} points</div>
              </div>
            ) : (
              <div>
                <div className="text-2xl mb-2">❌ Wrong!</div>
                <div>Lives left: {feedback.livesLeft}</div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          {!isAnswered && (
            <>
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="btn-primary flex-1"
              >
                Submit Answer
              </button>
              <button
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </>
          )}
          {isAnswered && (
            <button
              onClick={onClose}
              className="btn-primary w-full"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
