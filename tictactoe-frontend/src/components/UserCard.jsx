const UserCard = ({ user, onInvite }) => {
  const username = user?.username ?? '';
  const isOnline = Boolean(user?.online_status);

  return (
    <div className="group flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-lg font-bold text-white shadow-md">
          {(username[0] || '?').toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-white truncate">{username}</p>
            <span
              className="flex-shrink-0 inline-block rounded-full"
              style={{
                width: '10px',
                height: '10px',
                background: isOnline ? '#22c55e' : '#64748b',
                boxShadow: isOnline ? '0 0 18px rgba(34, 197, 94, 0.55)' : undefined
              }}
              aria-label={isOnline ? 'Online' : 'Offline'}
              title={isOnline ? 'Online' : 'Offline'}
            />
          </div>
          <p className="text-xs text-slate-400">{isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </div>

      <button
        onClick={onInvite}
        disabled={!isOnline}
        className="flex-shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-blue-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform duration-200"
      >
        Invite
      </button>
    </div>
  );
};

export default UserCard;
