# 📚 Code Snippet Manager

A fast, lightweight web app to save, organize, and retrieve your favorite code snippets — all stored locally in your browser. Built with **React 19** and **Vite**.

---

## ✨ Features

- **Create, edit & delete** snippets with title, description, and category
- **Multiple code blocks** per snippet, each with its own language tag
- **Built-in syntax highlighting** for JavaScript, TypeScript, React, Python, SQL, HTML, CSS, and more — no external library needed
- **Favorites** — star any snippet to pin it to the top
- **Search** by title or description in real time
- **Filter** by programming language
- **Sort** by newest, oldest, or alphabetical order
- **Group by category** (Frontend, Backend, Database, Algorithms, Utilities) or switch to a flat list
- **List & Grid view** modes
- **Collapsible** category groups and code blocks
- **Export** all snippets to a JSON file
- **Import** snippets from a JSON file (replace or merge)
- **Persistent storage** via `localStorage` — data survives page reloads
- **Keyboard shortcut**: `Esc` closes the snippet form

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| Vanilla CSS | Styling (no UI library) |
| localStorage | Client-side data persistence |
| gh-pages | GitHub Pages deployment |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/jordy/code-snippet-app.git
cd code-snippet-app

# Install dependencies
npm install
\`\`\`

### Running Locally

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:5173`.

### Building for Production

\`\`\`bash
npm run build
\`\`\`

The output will be in the `dist/` folder.

### Deploying to GitHub Pages

\`\`\`bash
npm run deploy
\`\`\`

This builds the project and publishes the `dist/` folder to the `gh-pages` branch.

---

## 📁 Project Structure

\`\`\`
src/
├── App.jsx               # Root component — state management, filtering, sorting
├── App.css               # Global styles
├── main.jsx              # React entry point
└── components/
    ├── SnippetForm.jsx   # Add / edit snippet form
    ├── SnippetList.jsx   # Renders grouped or flat snippet list
    ├── SnippetCard.jsx   # Individual snippet card with actions
    ├── CategoryGroup.jsx # Collapsible category section
    ├── SearchBar.jsx     # Search, language filter, and sort controls
    └── CodeBlock.jsx     # Custom syntax highlighter
\`\`\`

### Component Overview

| Component | Responsibility |
|---|---|
| `App.jsx` | Holds all application state; handles CRUD, import/export, filtering and sorting |
| `SnippetForm.jsx` | Controlled form for creating and editing snippets; supports multiple code blocks |
| `SnippetList.jsx` | Decides between grouped (by category) and flat rendering; shows favorites first |
| `CategoryGroup.jsx` | Collapsible section per category with icon and snippet count |
| `SnippetCard.jsx` | Displays snippet details; handles copy-to-clipboard, expand/collapse, edit, delete, and favorite toggle |
| `SearchBar.jsx` | Search input, language filter dropdown, and sort order selector |
| `CodeBlock.jsx` | Pure regex-based syntax highlighter; no third-party dependencies |

---

## 🗂️ Snippet Data Model

Each snippet is stored as a JSON object in `localStorage`:

\`\`\`json
{
  "id": 1710000000000,
  "title": "Array Filter Function",
  "description": "Brief optional description",
  "category": "Frontend",
  "codeBlocks": [
    { "code": "const evens = [1,2,3].filter(n => n % 2 === 0);", "language": "JavaScript" }
  ],
  "createdAt": "2026-03-10T12:00:00.000Z",
  "isFavorite": false
}
\`\`\`

### Supported Categories
`Frontend` · `Backend` · `Database` · `Algorithms` · `Utilities`

### Supported Languages
`JavaScript` · `TypeScript` · `React` · `Python` · `SQL` · `HTML` · `CSS` · `JSON` · `Other`

---

## 📤 Import / Export

- **Export** — Downloads all snippets as a dated `.json` file (e.g. `code-snippets-2026-03-10.json`).
- **Import** — Loads snippets from a `.json` file. A confirmation prompt lets you choose to **replace** all existing snippets or **merge** them with the current collection (imported IDs are re-assigned to avoid conflicts).

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build and deploy to GitHub Pages |
