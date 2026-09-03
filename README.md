markdown


<div align="center">
#  QR Spark — Modern QR Code Generator
A modern, fast, and feature-rich QR Code Generator built with pure **HTML5, CSS3, and Vanilla JavaScript**. Supports custom colors, error correction, high-resolution PNG downloads, local history, and dark/light themes.
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Design-Responsive-brightgreen.svg)]()
[![No Dependencies](https://img.shields.io/badge/Dependencies-Zero-success.svg)]()
[Live Demo](#-live-demo) • [Features](#-features) • [Installation](#-getting-started) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)
</div>
---
##  Preview
+-------------------------------------------------------------+ | [⚡ QR Spark] [ ☀️/🌙 ] [ 🕒 History ] | +-------------------------------------------------------------+ | | | [ Configuration ] [ QR Preview ] | | Enter Text / URL +-----------------------+ | | [ https://github.com... ] | | | | | [ QR CANVAS ] | | | Style Options: | | | | * Size: 300x300 px +-----------------------+ | | * Correction: High (30%) [ ⬇️ Download PNG ] | | * Colors: Custom Pickers [ 📋 Copy Text ] [ 🖼️ Copy ]| | | | [ ⚡ Generate ] [ 🔄 Reset ] | +-------------------------------------------------------------+



---
##  Features
###  Core Capabilities
- **Instant QR Generation**: Real-time generation of QR codes from text, URLs, contact info, and more.
- **High-Quality PNG Download**: Clean, uncompressed client-side PNG export directly to disk.
- **Zero API Dependency**: Offline capability with bundled HTML5 Canvas engine & public API fallback.
- **Smart Validation**: Input checks, shake animations, and error handling for empty/invalid inputs.
###  Customization (Level 2)
- **Multi-Resolution Support**: Export in sizes: `150×150`, `200×200`, `300×300`, and `400×400` px.
- **Dynamic Color Pickers**: Customize foreground and background colors with instant hex validation.
- **Error Correction Levels**: Low (7%), Medium (15%), Quartile (25%), High (30%).
- **Keyboard Shortcuts**: Press <kbd>Enter</kbd> inside input to instantly generate.
###  Advanced Features (Level 3)
- **Recent QR History Drawer**: Stored persistently using browser `localStorage` with thumbnails & timestamps.
- **Clipboard Integration**:
  - `Copy Text`: Copies the underlying URL/text.
  - `Copy Image`: Copies the QR image directly to clipboard (`ClipboardItem` API).
- **Dark & Light Mode**: Smooth transition theme switcher with ambient glow gradients.
- **Responsive Layout**: Designed for mobile devices, tablets, laptops, and ultra-wide displays.
---
##  Tech Stack & Concepts Used
- **HTML5**: Semantic elements, accessible form controls, `<canvas>`.
- **CSS3**: Custom properties (CSS variables), Glassmorphism, CSS Grid, Flexbox, Keyframe animations.
- **Vanilla JavaScript (ES6+)**:
  - `querySelector()` / `querySelectorAll()`
  - `addEventListener()` (click, keydown, input, change)
  - DOM Manipulation & Canvas API (`toDataURL`, `Blob`)
  - `localStorage` API for state persistence
  - Asynchronous handling (`async/await`, Promises)
  - Clipboard API integration
---
## 📂 Project Structure
```text
qr-code-generator/
│
├── index.html        # Main semantic markup & layout structure
├── style.css         # Styling, themes (light/dark), and responsive design
├── script.js         # Application logic, DOM events & localStorage
├── qrcode.min.js     # Lightweight client-side QR generation library
└── README.md         # Project documentation
 Getting Started
No build tools or Node.js required! Simply clone and open.

1. Clone the repository
bash


git clone https://github.com/YOUR_USERNAME/qr-code-generator.git
cd qr-code-generator
2. Run Locally
Open index.html in your favorite web browser:

Windows: Double-click index.html or run:
powershell


start index.html
macOS / Linux:
bash


open index.html
 Deploy to GitHub Pages
Push this project to your GitHub repository.
Go to your repository Settings → Pages.
Under Source, select Deploy from a branch and choose main / root.
Click Save. Your site will be live at https://YOUR_USERNAME.github.io/qr-code-generator/!
 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

📄 License
B.siva Suriya
