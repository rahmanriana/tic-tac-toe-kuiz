# Setup TicTacToe Realtime Multiplayer

## 1. Setup MySQL di Laragon

1. Buka Laragon.
2. Pastikan Apache/Nginx dan MySQL sudah running.
3. Buka `http://localhost/phpmyadmin`.
4. Login dengan:
   - Host: `localhost`
   - Username: `root`
   - Password: (kosong)
5. Klik `New`, isi nama database: `tictactoe_realtime`.
6. Klik `Create`.
7. Pilih database `tictactoe_realtime`, lalu klik `Import`.
8. Pilih file `tictactoe-backend/database.sql` dan jalankan import.

## 2. Query SQL database

Gunakan file `tictactoe-backend/database.sql`.

```sql
CREATE DATABASE IF NOT EXISTS tictactoe_realtime;
USE tictactoe_realtime;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  online_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_code VARCHAR(10) UNIQUE NOT NULL,
  player1_id INT,
  player2_id INT,
  status ENUM('waiting', 'playing', 'finished') DEFAULT 'waiting',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player1_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (player2_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_code VARCHAR(10) NOT NULL,
  sender_username VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_room_code (room_code)
);
```

## 3. Backend Setup

1. Buka terminal di `tictactoe-backend`.
2. Jalankan:
   ```bash
   npm install
   ```
3. Pastikan file `tictactoe-backend/.env` berisi:
   ```env
   PORT=3000
   NODE_ENV=development

   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=tictactoe_realtime
   DB_PORT=3306

   CLIENT_URL=http://localhost:5173
   ```
4. Jalankan backend:
   ```bash
   npm start
   ```
5. Backend akan tersedia di `http://localhost:3000`.

## 4. Frontend Setup

1. Buka terminal di `tictactoe-frontend`.
2. Jalankan:
   ```bash
   npm install
   ```
3. Buat file `.env` di folder `tictactoe-frontend` dengan isi:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_SOCKET_URL=http://localhost:3000
   ```
4. Jalankan frontend:
   ```bash
   npm run dev
   ```
5. Frontend akan tersedia di `http://localhost:5173`.

## 5. Flow Testing

1. Buka `http://localhost:5173`.
2. Register akun baru.
3. Login dengan akun tersebut.
4. Dashboard akan menampilkan user online.
5. Invite player lain dan accept invite.
6. Masuk ke game realtime dan gunakan chat di dalam game.

## 6. Notes

- Backend package sudah menggunakan `express`, `socket.io`, `mysql2`, `bcryptjs`, `cors`, dan `dotenv`.
- Database connection menggunakan `mysql2` pool di `tictactoe-backend/db.js`.
- Auth API ada di `POST /api/register` dan `POST /api/login`.
- Chat realtime menggunakan event Socket.IO `send-message` / `receive-message`.
- Invite realtime menggunakan event Socket.IO `invite-player`, `receive-invite`, `accept-invite`, dan `reject-invite`.
