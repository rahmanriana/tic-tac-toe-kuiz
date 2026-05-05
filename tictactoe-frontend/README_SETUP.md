# 🎮 Tic-Tac-Toe Quiz Frontend

Frontend React + Vite untuk game multiplayer Tic-Tac-Toe Quiz dengan real-time Socket.IO integration.

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16 atau lebih)
- npm atau yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Struktur Project

```
src/
├── components/          # React components
│   ├── Board.jsx       # Tic-tac-toe board grid
│   ├── Cell.jsx        # Individual board cell
│   ├── PlayerInfo.jsx  # Player stats display
│   └── QuizModal.jsx   # Quiz question modal
├── pages/              # Page components
│   ├── Lobby.jsx       # Lobby page (create/join room)
│   └── Game.jsx        # Main game page
├── hooks/              # Custom React hooks
│   └── useGame.js      # Game state management
├── services/           # API/Socket services
│   └── socketService.js # Socket.IO event handlers
├── socket/             # Socket configuration
│   └── index.js        # Socket.IO client setup
├── App.jsx             # Main app component
├── main.jsx            # Entry point
├── index.css           # Global styles (Tailwind)
└── App.css             # App styles
```

## 🔌 Socket.IO Events

### Emit Events
- `create-room` - Create new game room
- `join-room` - Join existing room
- `start-game` - Start the game
- `select-cell` - Select board cell
- `submit-answer` - Submit quiz answer
- `place-symbol` - Place X or O on board

### Listen Events
- `room-created` - Room created successfully
- `room-joined` - Joined room successfully
- `game-started` - Game has started
- `question-popup` - Quiz question appeared
- `answer-correct` - Answer is correct
- `answer-wrong` - Answer is wrong
- `board-updated` - Board state changed
- `game-over` - Game finished

## 🎨 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Socket.IO Client** - Real-time communication
- **Hooks** - State management

## 🎮 How to Play

1. **Create or Join Room**
   - Enter your name
   - Choose a theme
   - Create room or join with code

2. **Wait for Second Player**
   - Room waits for 2 players
   - Game starts when both ready

3. **Gameplay**
   - Take turns selecting board cells
   - Answer quiz questions correctly to place symbol
   - First to 3 in a row (horizontal, vertical, diagonal) wins
   - Or player with higher score after 3 rounds wins

4. **Game Over**
   - View final scores
   - Play again or return to lobby

## 🚨 Troubleshooting

### Cannot connect to server
- Make sure backend is running on `http://localhost:5000`
- Check CORS settings

### Socket events not working
- Open browser DevTools Console
- Check for errors
- Verify socket connection status

### Styling issues
- Run `npm install` to ensure Tailwind CSS is installed
- Try clearing browser cache

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Socket.IO Documentation](https://socket.io)
- [Tailwind CSS](https://tailwindcss.com)

## 📝 License

MIT
