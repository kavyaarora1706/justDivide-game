🎮 Just Divide - Kid Mode
A fully responsive ReactJS implementation of Just Divide - Kid Mode, a math-based puzzle game designed for children aged 7–12 to improve logical thinking, division skills, factors, and multiples through interactive drag-and-drop gameplay.

🚀 Live Demo
🔗 https://just-divide-game-ps08evwas-kavya-aroras-projects-efdf0a04.vercel.app

✨ Features
🎯 Core Gameplay

Interactive 4x4 puzzle grid
Drag-and-drop tile placement
Equal tile elimination logic
Division-based merge mechanics
Real-time score updates
Level progression system
Best score persistence using localStorage
Undo functionality
Hint system
Game Over detection
Restart game support


🧠 Merge Rules
1️⃣ Equal Tiles Disappear
If two touching tiles have the same value:
txt4 + 4 → removed

2️⃣ Divisible Merge
If the larger tile is divisible by the smaller tile:
txt12 + 3 → 4
15 + 5 → 3
9 + 3 → 3

3️⃣ Quotient of 1 Disappears
If division results in 1, the resulting tile is removed automatically.

🖼️ UI & Design
The project recreates the provided game mockup with:

Responsive fullscreen layout
Bubble-pattern background
Custom tile assets
Centered cat mascot
Smooth UI animations
Hover effects and transitions
Fixed 4x4 grid structure
Polished Game Over overlay


📱 Responsive Design
Optimized for:

💻 Desktop
📱 Mobile
📟 Tablet

Responsive techniques used:

CSS Grid
Flexbox
clamp()
aspect-ratio
media queries
viewport scaling


🛠️ Tech Stack
TechnologyPurposeReactJSFrontend frameworkJavaScriptGame logicCSS / TailwindCSSStylingdnd-kitDrag-and-droplocalStorageBest score persistence

📂 Project Structure
bashjustDivide-game/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Grid.jsx
│   │   ├── Header.jsx
│   │   ├── KeepSlot.jsx
│   │   ├── Queue.jsx
│   │   ├── ScoreBoard.jsx
│   │   ├── Tile.jsx
│   │   └── TrashSlot.jsx
│   │
│   ├── utils/
│   │   └── gameLogic.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js

🧭 Development Approach
The project was developed with a strong focus on:

recreating the provided UI accurately
implementing clean and maintainable React architecture
building responsive layouts for desktop, tablet, and mobile
separating gameplay logic from UI components
ensuring smooth drag-and-drop interactions

The development process followed an iterative approach:

Build the base layout
Implement the grid and tile system
Add drag-and-drop mechanics
Implement merge logic
Improve responsiveness
Add polish, animations, and Game Over states


🔑 Key Technical Decisions
Several important technical decisions were made during development:

Used React functional components and hooks for cleaner state management
Used CSS Grid for the fixed 4x4 puzzle board
Used Flexbox for responsive side panel layouts
Used dnd-kit for drag-and-drop interactions
Stored Best Score using browser localStorage
Implemented responsive breakpoints for desktop, tablet, and mobile layouts
Centralised all game logic in utils/gameLogic.js for maintainability
Designed the UI to scale safely without breaking alignment or overflow


⚙️ Installation & Setup
1️⃣ Clone Repository
bashgit clone https://github.com/kavyaarora1706/justDivide-game.git

2️⃣ Navigate to Project
bashcd justDivide-game

3️⃣ Install Dependencies
bashnpm install

4️⃣ Run Development Server
bashnpm run dev

🎮 Controls
ActionFunctionDrag TilePlace tile on boardKEEPStore / swap active tileTRASHDiscard active tileUndoRestore previous moveRestartReset game

💾 Local Storage
The game stores:

🏆 Best Score

using browser localStorage.

🧩 Game Over System
The game ends when:

all 16 cells are filled
no valid merges are possible

A centered overlay displays:

Final Score
Current Level
Best Score
Restart Button

The session timer stops automatically on Game Over.

✨ Animations & Polish
Implemented:

Tile hover effects
Smooth drag interactions
Merge animations
Overlay transitions
Button hover effects
Responsive scaling


🚧 Challenges Faced
Some key challenges during development included:

Implementing correct merge logic
Handling neighbor detection efficiently
Maintaining responsive scaling across devices
Preventing layout overflow and scrolling
Managing drag-and-drop interactions cleanly
Building a polished Game Over state
Maintaining consistent alignment across responsive breakpoints


🔮 Future Improvements
Potential future enhancements:

🔊 Sound effects
🎵 Background music
🏅 Leaderboards
⚡ Combo multipliers
🎨 More animations
🎚️ Difficulty modes
Better touch gesture support
Additional visual feedback for merges


📜 Assignment Context
This project was created as part of a ReactJS game development internship assignment focused on:

UI recreation accuracy
Game logic implementation
Responsiveness
Clean code architecture
Frontend problem-solving


👩‍💻 Author
Kavya Arora
GitHub: https://github.com/kavyaarora1706