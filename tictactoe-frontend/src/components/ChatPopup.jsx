import { useEffect, useRef } from 'react';

const ChatPopup = ({ messages, value, onChange, onSend, onClose, username, roomCode }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-modal">
      <div className="chat-card">
        <div className="chat-header">
          <div>
            <h2 className="text-xl font-extrabold text-white">💬 Room Chat</h2>
            <p className="text-xs text-slate-300 mt-1">Room: {roomCode}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white text-xl font-bold transition-colors"
            aria-label="Close chat"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="chat-body">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-32 text-slate-300/80">
              <p className="text-center">Belum ada pesan. Mulai chat!</p>
            </div>
          )}

          {messages.map((msg, index) => {
            const sender = String(msg?.sender_username || '').trim();
            const current = String(username || '').trim();
            const isSelf = sender.toLowerCase() === current.toLowerCase();
            return (
              <div key={index} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs ${isSelf ? 'self-end' : 'self-start'}`}>
                  <div
                    className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                      isSelf ? 'text-right text-cyan-200' : 'text-left text-slate-300'
                    }`}
                  >
                    {isSelf ? 'Kamu' : sender}
                  </div>

                  <div
                    className={`chat-bubble p-3 rounded-xl max-w-xs break-words ${
                      isSelf
                        ? 'bg-gradient-to-r from-purple-500/25 via-indigo-500/20 to-blue-500/20 border border-blue-300/30 text-white'
                        : 'bg-white/10 border border-white/20 text-white'
                    }`}
                  >
                    {msg?.message}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        <div className="chat-footer">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder="Ketik pesan..."
            className="input"
          />
          <button onClick={onSend} disabled={!value.trim()} className="btn-primary px-4 py-2 flex-shrink-0">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
