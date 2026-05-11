const InvitePopup = ({ invite, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass-card glass-panel w-full max-w-md">
        <div className="mb-6">
          <div className="text-sm uppercase tracking-widest text-cyan-200 font-bold">🎮 Game Invitation</div>
          <h2 className="text-2xl font-extrabold mt-3 text-white">
            {invite.fromUsername} mengajak kamu bermain!
          </h2>
          <p className="mt-2 text-slate-200/80">Terima undangan untuk masuk ke room lobby.</p>
        </div>

        <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-lg font-bold text-white">
              {(invite.fromUsername?.[0] || '?').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white truncate">{invite.fromUsername}</p>
              <p className="text-xs text-slate-200/70">Realtime multiplayer • 1v1</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
              onClick={onReject}
                 style={{ color: "white" }}
                     className="flex-1 px-4 py-3 rounded-full bg-red-500/20 border-2 border-red-300/60 font-bold hover:bg-red-500/30 transition-all [&_*]:!text-white"
>
                       ❌ Tolak
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-blue-400/40 transition-all"
          >
            ✅ Terima
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitePopup;

