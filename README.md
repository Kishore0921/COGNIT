# Cognit — AI-Powered Algorithm Learning Platform

Cognit is a state-of-the-art interactive web application designed to help computer science students and competitive programmers master algorithms and data structures. Powered directly by Google Gemini models, Cognit goes beyond standard coding assistance by providing deep mathematical proofs, multi-level progressive hints, custom-tailored viva prep, visual execution representations, and personalized learning path recommendations.

---

## 🌟 Visual Theme & Design System

Cognit features a custom-built, modern glassmorphic interface that adapts perfectly to dark and light modes. The design has been meticulously crafted around visual excellence:
- **Harmony of Colors:** Utilizes curated HSL color tokens to deliver soft, premium visual cues instead of harsh browser defaults.
- **Glassmorphism:** Card structures employ backdrop filters (`blur(16px) saturate(140%)`) and thin white borders to emulate modern desktop frames.
- **Micro-Animations:** Fluid, spring-based transitions (`cubic-bezier(0.34, 1.56, 0.64, 1)`) give life to user interactions, button states, and screen transitions.
- **MacOs Window Framing:** Textareas and inputs are wrapped in terminal-style title bars complete with decorative red, amber, and green dots.
- **Vibrant Hero Backgrounds:** The landing dashboard is accented by dynamic, floating background blobs overlaid with a sophisticated CSS dot-grid pattern.

---

## 🚀 Core Tech Stack

- **Framework:** Next.js 16.2.6 (App Router)
- **UI & Logic:** React 19.2.4 (Fully Client-Driven State with local hooks for immediate interactivity)
- **Styling:** Vanilla CSS 3 (`app/globals.css` containing customized responsive grids, layouts, themes, and animations)
- **AI Core:** Direct REST invocation of **Google Gemini API** (`gemini-3.5-flash` default, with `gemini-3.1-flash-lite` and `gemini-3.1-pro` support) utilizing customized system instructions and JSON schemas (`responseMimeType: 'application/json'`).
- **Code Syntax Highlighting:** `react-syntax-highlighter` configured with the Prism engine and a refined VS Code Dark Plus theme.
- **Data Persistence:** Persistent client state utilizing `localStorage` to keep track of user settings, practice history, and statistics.

---

## 📂 Project Architecture

```
algomind/
├── app/
│   ├── api/
│   │   ├── analyze/        # Problem breakdown, NLP extraction, & categorization
│   │   ├── generate/       # Target-specific clean code generator
│   │   ├── hints/          # Structured JSON 5-tier hint engine
│   │   ├── insights/       # User statistics cohort analysis & recommendations
│   │   ├── review/         # Code assessment & optimization recommender
│   │   └── viva/           # CS professor-level oral exam questions
│   ├── globals.css          # Design system & dark/light theme definitions
│   ├── layout.js            # Next.js Metadata, Viewports, and Root Layout
│   └── page.js              # Core SPA interface containing all UI views
├── lib/
│   ├── prompts.js           # Prompt engineering templates library & default problems
│   └── store.js             # Client state manager for localStorage syncing
├── package.json             # Project dependencies & launch scripts
└── README.md                # This documentation guide
```

---

## 🛠️ Complete Feature Deep-Dive

### 1. AI Problem Analysis & Classification
- **NLP Extraction:** Processes unstructured problem descriptions to extract key objective statements, data structures to use, operations, and summary constraints.
- **Paradigm Classification:** Assigns probability/confidence scores to primary and secondary algorithmic paradigms (e.g. Dynamic Programming, Greedy, Two Pointers, Graph Traversal).
- **Time/Space Complexities:** Calculates expected operational complexities based on input boundaries.

### 2. Code Generation (Multi-Language)
- Generates clean, idiomatic solutions in **Python, JavaScript, Java, or C++**.
- Code contains clear documentation headers, inline explanations, complexity notes, edge case handling, and executable driver/test examples at the bottom.

### 3. Progressive 5-Tier Hint System
Provides pedagogical scaffolding to encourage logical deductions instead of immediate spoilers:
1. **Level 1 — Nudge:** A gentle conceptual analogy or leading question that prompts path-finding without naming any specific algorithm or data structure.
2. **Level 2 — Direction:** Identifies the correct general algorithmic paradigm and justifies *why* it fits the constraints.
3. **Level 3 — Approach:** Outlines the sequence of operations, initialized data structures, and core loop details without displaying source code.
4. **Level 4 — Pseudocode:** A well-structured, line-by-line pseudocode blueprint using clean formatting.
5. **Level 5 — Solution:** A complete Python solution with a comprehensive comment explaining *every single line* of logic.

### 4. Interactive Step-by-Step Visualizer
- Dynamic bar-chart representation mapped to the problem's signature.
- Integrates full controls: **Play, Pause, Next Step, Previous Step, and Reset**.
- Color-coded states representing inactive, active (currently inspected), and completed elements.

### 5. Multi-Level Complexity Proofs
Translates mathematical complexities into three target learning audiences:
- **Beginner:** Simple, jargon-free analogies and manual loop counting with concrete inputs (e.g., $N=5$).
- **Intermediate:** Derived mathematics, showing recurrence relations, tree expansions, or summation math.
- **Interview:** Rapid, direct Big-O justifications optimized for fast verbal presentation during technical screenings.

### 6. Alternative Algorithm Trade-offs
- Displays a comparative matrix comparing the selected optimal choice against alternative approaches.
- Evaluates differences in Time/Space complexity, pros, and cons to build deep trade-off awareness.

### 7. Interactive Interview Prep Q&A
- Generates 6 category-specific follow-ups (conceptual, optimization, edge cases, follow-ups).
- Embedded within interactive, expandable cards showing the model answer.

### 8. Automated Code Review
- Users paste their code for assessment.
- Returns score overlays (0-100) for Correctness and Quality, identifies missing edge cases, and calculates differences in user complexity vs optimal complexity.
- Renders an optimized Python alternative if applicable.

### 9. Viva Prep (Oral Examination)
- Simulates an oral examination with 8 tailored conceptual questions.
- Categorized by difficulty levels (Basic, Intermediate, Advanced) and specific topics to test fundamental baseline knowledge.

### 10. Dashboard & AI Insights Engine
- **Paradigm Donut Chart:** A hand-crafted SVG donut chart mapping user practice distribution.
- **Personalized Insights:** Analyzes local practice metrics and streaks to synthesize user strengths, improvement areas, unexplored paradigms, motivational highlights, and recommend a specific **Next Challenge** (with sample description and difficulty).

---

## 📡 API Endpoint Reference

All communication is handled via POST requests with JSON payloads containing an `apiKey` and optional `model`.

### `POST /api/analyze`
* **Request:** `{"problem": "...", "apiKey": "...", "model": "..."}`
* **Response:** Returns JSON containing `title`, `difficulty`, `nlp_analysis`, `classification`, `selected_algorithm`, `alternatives`, `complexity_proof`, `edge_cases`, `interview_questions`, `visualization_type`, and `dry_run_example`.

### `POST /api/generate`
* **Request:** `{"problem": "...", "algorithm": "...", "language": "python|javascript|java|cpp", "apiKey": "...", "model": "..."}`
* **Response:** `{"code": "...", "language": "..."}`

### `POST /api/hints`
* **Request:** `{"problem": "...", "algorithm": "...", "level": 1-5, "apiKey": "...", "model": "..."}`
* **Response:** `{"hint": {"title", "level_name", "explanation", "steps", "key_insight", "code_snippet"}, "level": ...}`

### `POST /api/review`
* **Request:** `{"problem": "...", "code": "...", "apiKey": "...", "model": "..."}`
* **Response:** Returns JSON showing `overall_score`, `correctness` (score, issues, edge cases), `efficiency` (current vs optimal complexity, suggestions), `quality`, `summary`, and `optimized_code`.

### `POST /api/viva`
* **Request:** `{"problem": "...", "algorithm": "...", "code": "...", "apiKey": "...", "model": "..."}`
* **Response:** `{"questions": [{"question", "difficulty", "expected_answer", "topic"}]}`

### `POST /api/insights`
* **Request:** `{"stats": {...}, "apiKey": "...", "model": "..."}`
* **Response:** Returns JSON showing `strengths`, `weaknesses`, `missing_paradigms`, `next_challenge` (paradigm, difficulty, reason, example_problem), `difficulty_advice`, `motivation`, `skill_level`, `skill_score`, and `focus_areas`.

---

## 🚀 Setup & Installation

Follow these steps to run Cognit locally on your machine:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Clone and Navigate
```bash
git clone <repository_url>
cd algomind
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Setup your API Key
1. Obtain an API Key from [Google AI Studio](https://aistudio.google.com/).
2. Launch the Cognit app.
3. The Settings modal will open automatically on first load. Paste your API key and select your preferred model.
4. Settings are stored locally in your browser's `localStorage` and never transmitted to any third-party servers.
