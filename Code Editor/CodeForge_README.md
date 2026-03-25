# CodeForge — Online Code Editor with Live Preview

> Project #13 from the Internship Project Phase — Elevate Labs

A fully featured browser-based IDE for HTML, CSS, and JavaScript with real-time preview, Monaco Editor integration, and zero backend required.

---

## 🚀 How to Run

**Option 1 — Open directly in browser (no server needed):**
```
Double-click index.html  →  opens in your browser
```

**Option 2 — Local dev server (recommended for share URLs):**
```bash

python -m http.server 8080

npx serve .

```

---

## ✨ Features

### Core Editor
- **Monaco Editor** (same engine as VS Code) loaded via CDN
- Syntax highlighting for HTML, CSS, and JavaScript
- Bracket pair colorization, auto-indentation, IntelliSense
- Tab key inserts 2 spaces
- Custom dark theme (`codeforge-dark`)
- Cursor position, character count, line count in footer
- Code formatting via Monaco's built-in formatter

### Live Preview
- Renders inside a sandboxed `<iframe>` using `srcdoc`
- **Auto-run**: re-renders 950ms after you stop typing (toggleable)
- Manual run with **▶ Run** button or `Ctrl+Enter`
- Loading spinner overlay during render
- Console intercepts `console.log`, `console.warn`, `console.error` from the iframe

### Layout Views
| Mode | Shortcut |
|------|---------|
| Split (50/50) | Layout button |
| Editor Only | Layout button |
| Preview Only | Layout button |
| Wide Editor (62/38) | Layout button |
| Draggable divider | Click & drag the center handle |

### 9 Starter Templates
1. 🌐 Blank Canvas
2. ✨ CSS 3D Animation Card
3. 📊 Animated SVG Bar Chart (with tooltips)
4. 🎮 Snake Game (Canvas)
5. ⚡ Fetch API — Random User
6. 🌊 CSS Wave Animation
7. 🎨 CSS Grid Art (generative)
8. 📝 Todo App (with localStorage)
9. 🔢 Calculator (with keyboard support)

### Sharing (URL Encoding)
- Encodes full HTML/CSS/JS into a Base64 URL hash
- Anyone with the link can open and fork your code
- Works offline — no server required

### Snippet Management
- **Save** (`Ctrl+S`) — persists to `localStorage`
- **Snippets panel** — browse, load, and delete saved snippets
- Up to 30 snippets stored locally
- Auto-restores last session on reload

### Console Panel
- Toggle with **Console** button
- Color-coded output: info (teal), warn (yellow), error (red)
- Auto-opens on uncaught errors
- Clear button

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Monaco Editor 0.44 | Code editor engine (CDN) |
| Vanilla JavaScript | App logic, state management |
| CSS Custom Properties | Theming system |
| `<iframe srcdoc>` | Sandboxed live preview |
| `localStorage` | Snippet persistence |
| URL Hash (`#base64`) | Share/load code via URL |
| JetBrains Mono | Code font |
| Syne | UI font |

---

## 📁 Project Structure

```
codeforge/
└── index.html    ← Entire app (single file, self-contained)
```

Everything is in one HTML file — no build step, no npm, no dependencies to install.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Run code |
| `Ctrl + S` | Save snippet |
| `Tab` | Indent (2 spaces) |
| `Escape` | Close modals |
| `Ctrl + Z` | Undo (Monaco) |
| `Ctrl + Shift + F` | Format document (Monaco) |
| `Ctrl + /` | Toggle comment (Monaco) |
| `Ctrl + D` | Select next occurrence (Monaco) |

---

## 📄 Report

See `report.pdf` for the 1–2 page internship submission report.

---

## 🎯 Deliverables Checklist

- [x] Monaco Editor embedded (via CDN)
- [x] Live preview in iframe
- [x] 9 starter templates
- [x] Code sharing via URL (Base64 hash)
- [x] Save snippets to localStorage
- [x] Split, Editor-only, Preview-only, Wide-editor layouts
- [x] Draggable resize divider
- [x] Console with error/warn/log capture
- [x] Auto-run with debounce
- [x] Custom VS Code–style dark theme
- [x] Code formatting
- [x] Keyboard shortcuts
- [x] Responsive design
- [x] Single-file deployment (zero backend)
