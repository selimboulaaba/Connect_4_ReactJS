# Connect 4

[![Website](https://img.shields.io/website?url=https://connect-4-jade.vercel.app)](https://connect-4-jade.vercel.app)

## About

**Connect 4** is a classic two-player connection game where players take turns dropping colored discs into a grid. The objective is to connect four of one's own discs in a row, either horizontally, vertically, or diagonally.

## Features

- **Online multiplayer** in real time over WebSockets, with a 30-second turn timer, rematches, resign and in-game chat.
- **Play vs CPU** (easy / medium / hard minimax bot) and **pass & play** on one device.
- **Daily puzzle** (find the winning move, +50 XP), **4-player tournaments** and **live spectating**.
- **Friends** with live online status and one-click game invites.
- **Progression**: XP, levels, win/loss/draw stats, achievements, leaderboard and round history.
- Server-authoritative rules: the API validates every move and detects wins and draws, so clients can't cheat.
- Responsive design for phones and desktops, light and dark themes, keyboard-playable board.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Hosting**: Vercel (frontend), Render (backend)

## Run locally

```bash
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm install
npm run dev            # http://localhost:5173
```

When deploying (Vercel), set `VITE_API_URL` to the backend URL, and make sure the backend's `FRONT_URL` contains this site's URL.

## How to Play

1. Start a new game.
2. Take turns dropping discs into the columns.
3. Try to connect four discs in a row before your opponent.
4. The game ends when a player connects four discs or the grid is full.

## Project Link

You can access the **Connect 4** application [here](https://connect-4-jade.vercel.app).

## GitHub Repositories

- **Frontend Repository**: [GitHub - Frontend](https://github.com/selimboulaaba/Connect_4_ReactJS)
- **Backend Repository**: [GitHub - Backend](https://github.com/selimboulaaba/Connect_4_ExpressJS)

