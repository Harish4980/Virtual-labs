# Virtual Labs 🔬

An interactive, multi-language virtual programming laboratory platform. Learn, write, and execute code directly in your browser with real-time feedback and local project storage.

## ✨ Features

- **Multi-Language Interactive Editor:**
  - **JavaScript:** Real-time client-side execution in an isolated sandbox with console capture.
  - **Python 3:** In-browser Python compiler and execution powered by Skulpt.
  - **HTML / CSS / JS:** Live preview rendering with interactive DOM testing.
  - **C, C++, Java, .NET (C#), and PHP:** Interactive syntax evaluation, loop processing, standard input handling, and runtime logs.
- **CodeMirror Integration:** Syntax highlighting, line numbers, automatic indentation, and code formatting.
- **Local File Management:** Save, load, and delete up to 5 scripts per language stored locally in the browser (`localStorage`).
- **Dark & Light Mode:** Theme switcher with persistent state across all pages.
- **Authentication & Dashboard:** Sign In, Registration, and Password Reset simulation.
- **Responsive Design:** Optimized for desktop, tablet, and mobile browsers.

## 🚀 Getting Started

### Method 1: Run with Python HTTP Server
```bash
# Navigate to the project folder
cd "path/to/project virtual lab"

# Start the local server
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Method 2: Open Directly
Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

## 📁 Project Structure

```
├── index.html          # Landing page & feature showcase
├── index.css           # Landing page stylesheet
├── labs.html           # Lab selector for all languages
├── labs.css            # Labs grid stylesheet
├── editor.html         # Code editor & output console
├── editor.css          # Editor layout & dark mode styles
├── editor.js           # Multi-language execution engine & storage
├── signin.html         # Sign In / Register / Reset modal
├── sign.css            # Auth layout stylesheet
├── sign.js             # Authentication & form logic
├── contact.html        # Contact & support page
└── script.js           # Navigation, theme sync & sessions
```

## 🛠️ Built With

- **HTML5 & CSS3** (Flexbox & CSS Grid)
- **JavaScript (ES6+)**
- **CodeMirror 5** (Syntax editor & highlighting)
- **Skulpt** (In-browser Python 3 execution)
- **Font Awesome 6** (Vector icons)
- **Devicon** (Programming language logos)
