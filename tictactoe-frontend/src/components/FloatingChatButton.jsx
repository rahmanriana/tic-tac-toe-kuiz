const FloatingChatButton = ({ count, preview, onClick }) => {
  return (
    <div className="floating-chat-btn">
      {preview && (
        <div className="chat-preview animate-slideInUp">
          <p className="text-sm text-white break-words">{preview}</p>
        </div>
      )}

      <button
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white text-2xl font-bold shadow-xl shadow-blue-400/40 hover:shadow-blue-400/60 hover:scale-110 transition-all duration-200 flex items-center justify-center relative"
        aria-label="Open chat"
        title="Chat"
      >
        💬

        {count > 0 && (
          <span
            className="absolute flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse"
            style={{ top: '-0.5rem', right: '-0.5rem', minWidth: '1.75rem', height: '1.75rem', padding: '0 0.4rem' }}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingChatButton;
