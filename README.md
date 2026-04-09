# Endless Runner & Car Runner Games

A full-stack project built with React, Node.js (Express), and MongoDB, featuring a dynamic frontend with HTML5 Canvas drawing custom game sequences.

## 📖 Features
1. **Neon Runner**: A 2D side-scrolling platformer. The player squares off against gravity, using Jump to clear gaps over incoming obstacles.
2. **Car Runner**: A top-down 3-lane dodger. The player dodges oncoming traffic using Keyboard Left and Right arrows.
3. **Session Management**: Each game dynamically opens a session on the MongoDB Backend via `/api/session/start` and automatically records the scores globally at the end on Game Over.
4. **Dynamic Configuration**: Canvas environments fetch the difficulty modifiers iteratively from `/api/config` from the backend. 

---

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v16.0 or higher recommended)
- **MongoDB** running locally. (Requires connection port on `27017` which is default).

---

## 🚀 Setup Instructions

### 1. Database & Backend Server Setup
The backend runs its APIs automatically configured against a local MongoDB databse.

1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Make sure you install the dependencies:
   ```bash
   npm install
   ```
3. Run the Server:
   ```bash
   npm start
   ```
   *The server runs on http://localhost:5000 and should display `MongoDB Connected...`.*

### 2. Frontend React Game Setup
The UI utilizes Vite to securely render Canvas context alongside standard React functionality.

1. Open a **New/Second Terminal** and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite App:
   ```bash
   npm run dev
   ```
   *The front-end should now start gracefully on http://localhost:5173 or 5174. Check your terminal readout.*

---

## 🎮 How to Play

### Navigating the Menu
Open the Vite URL provided in your terminal in a web browser.
1. Enter your **Name**. You will join as a named user and your session will be created securely in your database.
2. Press **"Play Neon Runner"** or **"Play Car Runner"**. 

### Game Controls
- **Neon Runner**: Press **Spacebar** or click with your **Mouse** to jump over the obstacles.
- **Car Runner**: Use your **Left Arrow Key** or **Right Arrow Key** (*or A & D*) to switch lanes seamlessly.

### Mechanics & Scoring
The longer you survive, the tougher the obstacles spawn! If you strike an obstacle, your final score is recorded and shipped off immediately to the leaderboard database where it'll await the world ranking to dynamically update your main menu screens!
