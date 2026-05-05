import { useState, useEffect } from 'react';
import socket from '../socket/index';
import { gameService } from '../services/socketService';

export const useGame = (roomCode) => {
  const [gameState, setGameState] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedCellPosition, setSelectedCellPosition] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalState, setFinalState] = useState(null);

  // Listen to socket events
  useEffect(() => {
    const handleGameStarted = (data) => {
      setGameState(data.game);
      setCurrentQuestion(data.question);
    };

    const handleQuestionPopup = (data) => {
      console.log('=== QUIZ POPUP EVENT RECEIVED ===');
      console.log('Question data:', data);
      console.log('Question:', data.question);
      console.log('Position:', data.position);
      setCurrentQuestion(data.question);
      setSelectedCellPosition(data.position);
      setShowQuizModal(true);
      setAnswerFeedback(null);
      console.log('Quiz modal should now be visible');
    };


    const handleAnswerCorrect = (data) => {
      console.log('=== ANSWER-CORRECT EVENT RECEIVED ===');
      setAnswerFeedback({ type: 'correct', points: data.points });
      setTimeout(() => {
        setShowQuizModal(false);
        setAnswerFeedback(null);
        setSelectedCellPosition(null);
      }, 1500);
    };

    const handleAnswerWrong = (data) => {
      console.log('=== ANSWER-WRONG EVENT RECEIVED ===');
      setAnswerFeedback({ type: 'wrong', livesLeft: data.livesLeft });
      setTimeout(() => {
        setShowQuizModal(false);
        setAnswerFeedback(null);
        setSelectedCellPosition(null);
      }, 1500);
    };

    const handleGameUpdated = (data) => {
      console.log('=== GAME-UPDATED EVENT RECEIVED ===');
      console.log('New game state:', data);
      setGameState(data);
    };

    const handleGameOver = (data) => {
      setGameOver(true);
      setFinalState(data.finalState);
    };

    const handleError = (error) => {
      setError(error.message);
    };

    socket.on('game-started', handleGameStarted);
    socket.on('question-popup', handleQuestionPopup);
    socket.on('answer-correct', handleAnswerCorrect);
    socket.on('answer-wrong', handleAnswerWrong);
    socket.on('game-updated', handleGameUpdated);
    socket.on('game-over', handleGameOver);
    socket.on('error', handleError);

    return () => {
      socket.off('game-started', handleGameStarted);
      socket.off('question-popup', handleQuestionPopup);
      socket.off('answer-correct', handleAnswerCorrect);
      socket.off('answer-wrong', handleAnswerWrong);
      socket.off('game-updated', handleGameUpdated);
      socket.off('game-over', handleGameOver);
      socket.off('error', handleError);
    };
  }, []);

  const handleSelectCell = (position) => {
    setSelectedCellPosition(position);
    gameService.selectCell(roomCode, position);
  };

  const handleSubmitAnswer = (answerIndex) => {
    gameService.submitAnswer(roomCode, answerIndex, selectedCellPosition);
  };

  const handlePlaceSymbol = () => {
    if (selectedCellPosition !== null) {
      gameService.placeSymbol(roomCode, selectedCellPosition);
    }
  };

  return {
    gameState,
    currentQuestion,
    loading,
    error,
    showQuizModal,
    setShowQuizModal,
    answerFeedback,
    gameOver,
    finalState,
    selectedCellPosition,
    handleSelectCell,
    handleSubmitAnswer,
    handlePlaceSymbol
  };
};

export default useGame;
