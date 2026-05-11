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
  const isWrong = feedback?.type === 'wrong';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', padding: '1rem' }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: '56rem',
          background: 'rgba(255,255,255,0.98)',
          borderRadius: '16px',
          boxShadow: '0 30px 90px rgba(0,0,0,0.35)',
          padding: '2rem',
          color: '#0f172a'
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '0.35rem 0.7rem',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.9rem',
              background:
                question.difficulty === 'mudah'
                  ? 'rgba(34,197,94,0.15)'
                  : question.difficulty === 'menengah'
                  ? 'rgba(250,204,21,0.18)'
                  : 'rgba(239,68,68,0.15)',
              color:
                question.difficulty === 'mudah'
                  ? '#166534'
                  : question.difficulty === 'menengah'
                  ? '#854d0e'
                  : '#991b1b'
            }}
          >
            {getDifficultyLabel(question.difficulty)}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.35rem, 2.1vw, 2rem)',
              fontWeight: 900,
              marginTop: '0.75rem',
              lineHeight: 1.2
            }}
          >
            {question.question}
          </h2>
        </div>

        <div style={{ display: 'grid', gap: '0.9rem', marginBottom: '1.5rem' }}>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={isAnswered}
              style={{
                ...(function () {
                  const isSelected = selectedAnswer === index;
                  const isCorrectOption = typeof question.correctAnswer === 'number' && index === question.correctAnswer;
                  const showCorrect = Boolean(feedback) && isCorrectOption;
                  const showWrong = Boolean(feedback) && isSelected && !isCorrectOption;

                  if (!feedback && isSelected) {
                    return {
                      background: 'rgba(99,102,241,0.18)',
                      border: '2px solid rgba(99,102,241,0.85)',
                      boxShadow: '0 12px 26px rgba(99,102,241,0.18)'
                    };
                  }

                  if (showCorrect) {
                    return {
                      background: 'rgba(34,197,94,0.18)',
                      border: '2px solid rgba(34,197,94,0.85)'
                    };
                  }

                  if (showWrong) {
                    return {
                      background: 'rgba(239,68,68,0.14)',
                      border: '2px solid rgba(239,68,68,0.85)'
                    };
                  }

                  return null;
                })(),
                width: '100%',
                textAlign: 'left',
                borderRadius: '10px',
                border: '2px solid rgba(15,23,42,0.55)',
                background: '#e5e7eb',
                padding: '1.25rem 1.2rem',
                fontWeight: 800,
                fontSize: '1.02rem',
                color: '#0f172a',
                cursor: isAnswered ? 'not-allowed' : 'pointer',
                transition: 'transform 160ms ease, box-shadow 160ms ease, background 160ms ease'
              }}
              onMouseEnter={(e) => {
                if (isAnswered) return;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 12px 26px rgba(15,23,42,0.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span
                className="font-bold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '999px',
                  marginRight: '0.75rem',
                  background:
                    selectedAnswer === index ? 'rgba(99,102,241,0.95)' : 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(15,23,42,0.12)',
                  color: selectedAnswer === index ? 'white' : '#0f172a'
                }}
              >
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>

        {feedback && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'center',
              border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`,
              background: isCorrect ? 'rgba(34,197,94,0.14)' : 'rgba(239,68,68,0.12)'
            }}
          >
            {isCorrect ? (
              <div style={{ fontWeight: 900, fontSize: '1.8rem', color: '#166534' }}>
                ✅ Correct!
                <div style={{ marginTop: '0.35rem', fontSize: '1.05rem', color: '#14532d' }}>
                  +{feedback.points} points
                </div>
              </div>
            ) : (
              <div style={{ fontWeight: 900, fontSize: '1.8rem', color: '#991b1b' }}>
                ❌ Wrong!
                <div style={{ marginTop: '0.35rem', fontSize: '1.05rem', color: '#7f1d1d' }}>
                  Lives left: {feedback.livesLeft}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {!isAnswered && (
            <>
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                style={{
                  flex: '1 1 12rem',
                  padding: '0.9rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 900,
                  color: 'white',
                  background: selectedAnswer === null ? '#c4b5fd' : '#a78bfa',
                  cursor: selectedAnswer === null ? 'not-allowed' : 'pointer'
                }}
              >
                Submit Answer
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: '0 0 auto',
                  padding: '0.9rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(15,23,42,0.10)',
                  background: '#f3f4f6',
                  color: '#0f172a',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                Tutup
              </button>
            </>
          )}
          {isAnswered && (
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 900,
                color: 'white',
                background: '#7c3aed',
                cursor: 'pointer'
              }}
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
