'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { EXAMPLE_PROBLEMS } from '@/lib/prompts';

// ─── SVG Icon Registry Helper ───
function Icon({ name, size = 16, className = '', style = {}, ...props }) {
  const customStyle = {
    width: size,
    height: size,
    display: 'inline-block',
    verticalAlign: 'middle',
    flexShrink: 0,
    ...style
  };

  const icons = {
    analysis: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        <circle cx="12" cy="12" r="3" />
        <path d="m14 14 3.5 3.5" />
      </svg>
    ),
    code: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    complexity: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M21.3 15.3a2.82 2.82 0 0 1 0 4c-1 1-2.5 1-3.5 0L2.8 4.3a2.82 2.82 0 0 1 0-4c1-1 2.5-1 3.5 0Z" />
        <path d="m5.6 11.7 4.5-4.5" />
        <path d="m8.8 14.8 4.5-4.5" />
        <path d="m12 18 4.5-4.5" />
      </svg>
    ),
    alternatives: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <line x1="6" y1="3" x2="6" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
    visualization: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    hints: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
    interview: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    review: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    viva: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
    dashboard: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    refresh: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
    bolt: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    rocket: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M12 12l9-9-9 9Z" />
        <path d="M12 2c0 0-4.5 4.5-4.5 9.5 0 2.25 1 4.5 2.5 6l6-6c1.5-1.5 3.75-2.5 6-2.5C22 5 22 2 22 2Z" />
      </svg>
    ),
    sparkles: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
      </svg>
    ),
    pencil: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
    copy: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
    close: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    tag: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" />
      </svg>
    ),
    document: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    arrowRight: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    chevronLeft: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <polyline points="15 18 9 12 15 6" />
      </svg>
    ),
    chevronRight: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
    chevronDown: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    chevronUp: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <polyline points="18 15 12 9 6 15" />
      </svg>
    ),
    play: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    pause: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </svg>
    ),
    undo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <polyline points="3 3 3 8 8 8" />
      </svg>
    ),
    menu: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    sun: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    moon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    target: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    trophy: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    brain: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={customStyle} className={className} {...props}>
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
        <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
        <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
        <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
        <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
        <path d="M6 18a4 4 0 0 1-1.967-.516" />
        <path d="M19.967 17.484A4 4 0 0 1 18 18" />
      </svg>
    )
  };

  return icons[name] || null;
}

// ─── Sidebar Panel Definitions ───
const PANELS = [
  { id: 'analysis', icon: 'analysis', label: 'Analysis', section: 'results' },
  { id: 'code', icon: 'code', label: 'Code', section: 'results' },
  { id: 'complexity', icon: 'complexity', label: 'Complexity', section: 'results' },
  { id: 'alternatives', icon: 'alternatives', label: 'Alternatives', section: 'results' },
  { id: 'visualization', icon: 'visualization', label: 'Visualization', section: 'results' },
  { id: 'hints', icon: 'hints', label: 'Hints', section: 'learn' },
  { id: 'interview', icon: 'interview', label: 'Interview Q&A', section: 'learn' },
  { id: 'review', icon: 'review', label: 'Code Review', section: 'learn' },
  { id: 'viva', icon: 'viva', label: 'Viva Prep', section: 'learn' },
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', section: 'track' },
];

const LANGUAGES = ['python', 'javascript', 'java', 'cpp'];
const LANG_LABELS = { python: 'Python', javascript: 'JavaScript', java: 'Java', cpp: 'C++' };
const HINT_LABELS = ['Nudge', 'Direction', 'Approach', 'Pseudocode', 'Solution'];

// ─── Main Page Component ───
export default function Home() {
  // State
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-3.5-flash');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [problem, setProblem] = useState('');
  const [activePanel, setActivePanel] = useState('analysis');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [screenTransition, setScreenTransition] = useState('');

  // AI Results
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [lastAction, setLastAction] = useState(null);

  // Code
  const [generatedCode, setGeneratedCode] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [isGenerating, setIsGenerating] = useState(false);

  // Hints
  const [hints, setHints] = useState({});
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Review
  const [userCode, setUserCode] = useState('');
  const [review, setReview] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);

  // Viva
  const [vivaQuestions, setVivaQuestions] = useState(null);
  const [isGeneratingViva, setIsGeneratingViva] = useState(false);

  // Interview expand
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Complexity proof level
  const [complexityLevel, setComplexityLevel] = useState('beginner');

  // Stats (persisted)
  const [stats, setStats] = useState({
    totalProblems: 0, paradigms: {}, difficulties: { easy: 0, medium: 0, hard: 0 }, streak: 0
  });

  // AI Insights
  const [insights, setInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Viz state
  const [vizStep, setVizStep] = useState(0);
  const [vizPlaying, setVizPlaying] = useState(false);
  const vizRef = useRef(null);
  const vizInterval = useRef(null);

  // Load persisted data
  useEffect(() => {
    const key = localStorage.getItem('algomind_gemini_api_key') || localStorage.getItem('algomind_api_key') || '';
    const savedStats = localStorage.getItem('algomind_stats');
    let savedModel = localStorage.getItem('algomind_gemini_model');
    const savedTheme = localStorage.getItem('algomind_theme') || 'light';
    if (!savedModel || savedModel.includes('1.5') || savedModel.includes('2.0')) {
      savedModel = 'gemini-3.5-flash';
      localStorage.setItem('algomind_gemini_model', 'gemini-3.5-flash');
    }
    if (key) setApiKey(key.trim());
    if (savedModel) setModel(savedModel);
    if (savedStats) {
      try { setStats(JSON.parse(savedStats)); } catch (e) { /* ignore */ }
    }
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (!key) setSettingsOpen(true);
    setMounted(true);
  }, []);

  // Save stats
  useEffect(() => {
    localStorage.setItem('algomind_stats', JSON.stringify(stats));
  }, [stats]);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('algomind_theme', next);
  }, [theme]);

  // Screen transition helper
  const triggerTransition = useCallback((callback) => {
    setScreenTransition('screen-exit');
    setTimeout(() => {
      callback();
      setScreenTransition('screen-enter');
      setTimeout(() => setScreenTransition(''), 450);
    }, 300);
  }, []);

  // ─── API Handlers ───
  const handleAnalyze = useCallback(async () => {
    if (!apiKey) { setSettingsOpen(true); return; }
    if (!problem.trim()) { setError('Please enter a problem description'); return; }

    setIsAnalyzing(true);
    setError('');
    setLastAction(null);
    setAnalysis(null);
    setGeneratedCode({});
    setHints({});
    setCurrentHintLevel(0);
    setReview(null);
    setVivaQuestions(null);
    setVizStep(0);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, apiKey, model }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLastAction({ type: 'analyze' });
        return;
      }
      triggerTransition(() => {
        setAnalysis(data);
        setActivePanel('analysis');
      });

      // Update stats
      setStats(prev => ({
        ...prev,
        totalProblems: prev.totalProblems + 1,
        paradigms: {
          ...prev.paradigms,
          [data.classification?.primary_paradigm_label || 'Other']:
            (prev.paradigms[data.classification?.primary_paradigm_label || 'Other'] || 0) + 1,
        },
        difficulties: {
          ...prev.difficulties,
          [data.difficulty || 'medium']: (prev.difficulties[data.difficulty || 'medium'] || 0) + 1,
        },
      }));
    } catch (e) {
      setError('Network error. Please check your connection.');
      setLastAction({ type: 'analyze' });
    } finally {
      setIsAnalyzing(false);
    }
  }, [problem, apiKey]);

  const handleGenerateCode = useCallback(async (lang) => {
    if (!apiKey || !analysis) return;
    if (generatedCode[lang]) { setSelectedLanguage(lang); return; }

    setIsGenerating(true);
    setSelectedLanguage(lang);
    setError('');
    setLastAction(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem, algorithm: analysis.selected_algorithm?.name || '',
          language: lang, apiKey, model,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLastAction({ type: 'generateCode', lang });
        return;
      }
      setGeneratedCode(prev => ({ ...prev, [lang]: data.code }));
    } catch (e) {
      setError('Code generation failed');
      setLastAction({ type: 'generateCode', lang });
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey, analysis, problem, generatedCode]);

  const handleGetHint = useCallback(async (level) => {
    if (!apiKey || !analysis || level > currentHintLevel + 1) return;
    if (hints[level]) { setCurrentHintLevel(level); return; }

    setIsLoadingHint(true);
    setError('');
    setLastAction(null);
    try {
      const res = await fetch('/api/hints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem, algorithm: analysis.selected_algorithm?.name || '',
          level, apiKey, model,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLastAction({ type: 'hint', level });
        return;
      }
      setHints(prev => ({ ...prev, [level]: data.hint }));
      setCurrentHintLevel(level);
    } catch (e) {
      setError('Hint generation failed');
      setLastAction({ type: 'hint', level });
    } finally {
      setIsLoadingHint(false);
    }
  }, [apiKey, analysis, problem, hints, currentHintLevel]);

  const handleReview = useCallback(async () => {
    if (!apiKey || !userCode.trim()) return;

    setIsReviewing(true);
    setReview(null);
    setError('');
    setLastAction(null);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, code: userCode, apiKey, model }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLastAction({ type: 'review' });
        return;
      }
      setReview(data);
    } catch (e) {
      setError('Review failed');
      setLastAction({ type: 'review' });
    } finally {
      setIsReviewing(false);
    }
  }, [apiKey, problem, userCode]);

  const handleGenerateViva = useCallback(async () => {
    if (!apiKey || !analysis) return;

    setIsGeneratingViva(true);
    setError('');
    setLastAction(null);
    try {
      const res = await fetch('/api/viva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem, algorithm: analysis.selected_algorithm?.name || '',
          code: generatedCode.python || '', apiKey, model,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLastAction({ type: 'viva' });
        return;
      }
      setVivaQuestions(data.questions);
    } catch (e) {
      setError('Viva generation failed');
      setLastAction({ type: 'viva' });
    } finally {
      setIsGeneratingViva(false);
    }
  }, [apiKey, analysis, problem, generatedCode]);

  const handleGetInsights = useCallback(async () => {
    if (!apiKey) { setSettingsOpen(true); return; }
    if (stats.totalProblems === 0) { setError('Analyze at least one problem first to get personalized insights.'); return; }

    setIsLoadingInsights(true);
    setError('');
    setLastAction(null);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats, apiKey, model }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLastAction({ type: 'insights' });
        return;
      }
      setInsights(data);
    } catch (e) {
      setError('Failed to generate insights.');
      setLastAction({ type: 'insights' });
    } finally {
      setIsLoadingInsights(false);
    }
  }, [apiKey, stats, model]);

  const handleRetry = useCallback(() => {
    if (!lastAction) return;
    const { type } = lastAction;
    if (type === 'analyze') {
      handleAnalyze();
    } else if (type === 'generateCode') {
      handleGenerateCode(lastAction.lang);
    } else if (type === 'hint') {
      handleGetHint(lastAction.level);
    } else if (type === 'review') {
      handleReview();
    } else if (type === 'viva') {
      handleGenerateViva();
    } else if (type === 'insights') {
      handleGetInsights();
    }
  }, [lastAction, handleAnalyze, handleGenerateCode, handleGetHint, handleReview, handleGenerateViva, handleGetInsights]);

  const renderErrorAlert = () => {
    if (!error) return null;
    const isRateLimit = error.includes('429') || error.toLowerCase().includes('rate limit') || error.toLowerCase().includes('exhausted');
    return (
      <div className="error-alert">
        <div className="error-alert-header">
          <Icon name="warning" size={16} className="error-alert-icon" style={{ color: 'var(--accent-rose)' }} />
          <span className="error-alert-title">
            {isRateLimit ? 'Gemini API Rate Limit Exceeded (429)' : 'An Error Occurred'}
          </span>
          <button className="error-alert-close" onClick={() => { setError(''); setLastAction(null); }} title="Dismiss">
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="error-alert-body">
          {isRateLimit ? (
            <p>
              The free tier of the Gemini API is limited to <strong>15 Requests Per Minute (RPM)</strong>. 
              If you have been performing multiple actions in quick succession, please wait a minute before retrying. 
              Alternatively, you can verify your API key quota, status, and billing settings on 
              <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="error-alert-link"> Google AI Studio</a>.
            </p>
          ) : (
            <p>{error}</p>
          )}
        </div>
        <div className="error-alert-actions">
          {lastAction && (
            <button className="btn btn-sm btn-primary" onClick={handleRetry}>
              <Icon name="refresh" size={14} style={{ marginRight: 6 }} /> Retry Action
            </button>
          )}
          <button className="btn btn-sm btn-secondary" onClick={() => setSettingsOpen(true)}>
            <Icon name="settings" size={14} style={{ marginRight: 6 }} /> Update API Key
          </button>
        </div>
      </div>
    );
  };

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
  };

  const selectExample = (example) => {
    setProblem(example.description);
  };

  // ─── Visualization: Simple sorting visualization ───
  const generateVizData = useCallback(() => {
    if (!analysis) return [];
    const type = analysis.visualization_type;
    if (type === 'array') {
      return [5, 3, 8, 1, 9, 2, 7, 4, 6];
    }
    if (type === 'graph' || type === 'tree' || type === 'matrix') {
      return [4, 2, 6, 1, 3, 5, 7];
    }
    return [5, 3, 8, 1, 9, 2, 7, 4, 6];
  }, [analysis]);

  // ─── Render Panels ───

  const renderAnalysisPanel = () => {
    if (!analysis) return (
      <div className="empty-state">
        <div className="empty-state-icon"><Icon name="sparkles" size={48} /></div>
        <div className="empty-state-title">Enter a problem to analyze</div>
        <div className="empty-state-desc">Paste any algorithm problem and Cognit will classify it, select the optimal algorithm, and generate a complete learning package.</div>
      </div>
    );

    return (
      <div className="slide-in">
        {/* Classification */}
        <div className="analysis-section">
          <div className="analysis-section-title"><Icon name="interview" size={16} style={{ marginRight: 8 }} /> Classification</div>
          <div className="paradigm-card">
            <div className="paradigm-confidence">
              {Math.round((analysis.classification?.confidence || 0) * 100)}%
            </div>
            <div>
              <div className="paradigm-name">{analysis.classification?.primary_paradigm_label}</div>
              <div className="paradigm-desc">{analysis.classification?.reasoning}</div>
            </div>
          </div>
          {analysis.classification?.secondary_paradigms?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {analysis.classification.secondary_paradigms.map((p, i) => (
                <span key={i} className="badge badge-paradigm">
                  {p.label} ({Math.round(p.confidence * 100)}%)
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Selected Algorithm */}
        <div className="analysis-section">
          <div className="analysis-section-title"><Icon name="bolt" size={16} style={{ marginRight: 8 }} /> Selected Algorithm</div>
          <div className="card card-glow">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: '16px', fontWeight: 700 }}>
                {analysis.selected_algorithm?.name}
              </span>
              <span className={`badge badge-${analysis.difficulty}`}>
                {analysis.difficulty}
              </span>
            </div>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.7 }}>
              {analysis.selected_algorithm?.description}
            </p>
            <div className="complexity-display mt-3">
              <div className="complexity-item">
                <div className="complexity-label">Time</div>
                <div className="complexity-value">{analysis.selected_algorithm?.time_complexity}</div>
              </div>
              <div className="complexity-item">
                <div className="complexity-label">Space</div>
                <div className="complexity-value">{analysis.selected_algorithm?.space_complexity}</div>
              </div>
            </div>
          </div>
        </div>

        {/* NLP Analysis */}
        <div className="analysis-section">
          <div className="analysis-section-title"><Icon name="review" size={16} style={{ marginRight: 8 }} /> NLP Analysis</div>
          <div className="card">
            <div className="mb-3">
              <span className="text-muted text-xs font-bold" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>DATA STRUCTURES</span>
              <div className="flex gap-2 flex-wrap mt-2">
                {analysis.nlp_analysis?.data_structures?.map((ds, i) => (
                  <span key={i} className="tag">{ds}</span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <span className="text-muted text-xs font-bold" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>OPERATIONS</span>
              <div className="flex gap-2 flex-wrap mt-2">
                {analysis.nlp_analysis?.operations?.map((op, i) => (
                  <span key={i} className="tag">{op}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-muted text-xs font-bold" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>OBJECTIVE</span>
              <p className="text-secondary text-sm mt-2">{analysis.nlp_analysis?.objective}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {analysis.tags?.length > 0 && (
          <div className="analysis-section">
            <div className="analysis-section-title"><Icon name="tag" size={16} style={{ marginRight: 8 }} /> Tags</div>
            <div className="flex gap-2 flex-wrap">
              {analysis.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
            </div>
          </div>
        )}

        {/* Edge Cases */}
        {analysis.edge_cases?.length > 0 && (
          <div className="analysis-section">
            <div className="analysis-section-title"><Icon name="warning" size={16} style={{ marginRight: 8 }} /> Edge Cases</div>
            <div className="card">
              {analysis.edge_cases.map((ec, i) => (
                <div key={i} style={{ padding: '6px 0', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-amber)' }}>•</span> {ec}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCodePanel = () => {
    if (!analysis) return (
      <div className="empty-state">
        <div className="empty-state-icon"><Icon name="code" size={48} /></div>
        <div className="empty-state-title">Analyze a problem first</div>
        <div className="empty-state-desc">Code will be generated after analysis completes.</div>
      </div>
    );

    return (
      <div className="slide-in">
        <div className="tabs mb-4">
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              className={`tab ${selectedLanguage === lang ? 'active' : ''}`}
              onClick={() => handleGenerateCode(lang)}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>

        {isGenerating ? (
          <div className="loader"><div className="spinner" /> Generating {LANG_LABELS[selectedLanguage]} code...</div>
        ) : generatedCode[selectedLanguage] ? (
          <div className="code-block">
            <div className="code-block-header">
              <span className="code-block-lang">{LANG_LABELS[selectedLanguage]}</span>
              <button className="copy-btn" onClick={() => copyCode(generatedCode[selectedLanguage])}>
                <Icon name="copy" size={14} style={{ marginRight: 6 }} /> Copy
              </button>
            </div>
            <SyntaxHighlighter
              language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
              style={vscDarkPlus}
              customStyle={{
                background: 'var(--bg-code)',
                margin: 0,
                padding: '16px',
                fontSize: '13px',
                lineHeight: '1.7',
                maxHeight: '600px',
              }}
              showLineNumbers
            >
              {generatedCode[selectedLanguage]}
            </SyntaxHighlighter>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <button className="btn btn-primary" onClick={() => handleGenerateCode(selectedLanguage)}>
              <Icon name="sparkles" size={14} style={{ marginRight: 6 }} /> Generate {LANG_LABELS[selectedLanguage]} Code
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderComplexityPanel = () => {
    if (!analysis?.complexity_proof) return (
      <div className="empty-state">
        <div className="empty-state-icon"><Icon name="complexity" size={48} /></div>
        <div className="empty-state-title">Analyze a problem first</div>
        <div className="empty-state-desc">Complexity proofs at three levels will appear here.</div>
      </div>
    );

    const levels = [
      { id: 'beginner', label: 'Beginner', color: 'var(--accent-emerald)' },
      { id: 'intermediate', label: 'Intermediate', color: 'var(--accent-amber)' },
      { id: 'interview', label: 'Interview', color: 'var(--accent-rose)' },
    ];

    return (
      <div className="slide-in">
        <div className="complexity-display mb-4">
          <div className="complexity-item">
            <div className="complexity-label">Time</div>
            <div className="complexity-value">{analysis.selected_algorithm?.time_complexity}</div>
          </div>
          <div className="complexity-item">
            <div className="complexity-label">Space</div>
            <div className="complexity-value">{analysis.selected_algorithm?.space_complexity}</div>
          </div>
        </div>

        <div className="tabs mb-4">
          {levels.map(l => (
            <button key={l.id} className={`tab ${complexityLevel === l.id ? 'active' : ''}`} onClick={() => setComplexityLevel(l.id)}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="card card-glow">
          <p style={{ lineHeight: 1.9, color: 'var(--text-primary)', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
            {analysis.complexity_proof[complexityLevel]}
          </p>
        </div>
      </div>
    );
  };

  const renderAlternativesPanel = () => {
    if (!analysis?.alternatives?.length) return (
      <div className="empty-state">
        <div className="empty-state-icon"><Icon name="alternatives" size={48} /></div>
        <div className="empty-state-title">No alternatives yet</div>
        <div className="empty-state-desc">Analyze a problem to see alternative approaches.</div>
      </div>
    );

    return (
      <div className="slide-in">
        <div className="analysis-section-title mb-3"><Icon name="bolt" size={16} style={{ marginRight: 8 }} /> Recommended: {analysis.selected_algorithm?.name}</div>
        <table className="alt-comparison">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Time</th>
              <th>Space</th>
              <th>Pros</th>
              <th>Cons</th>
            </tr>
          </thead>
          <tbody>
            <tr className="recommended">
              <td><Icon name="star" size={14} style={{ marginRight: 6, color: 'var(--accent-amber)' }} /> {analysis.selected_algorithm?.name}</td>
              <td className="font-mono">{analysis.selected_algorithm?.time_complexity}</td>
              <td className="font-mono">{analysis.selected_algorithm?.space_complexity}</td>
              <td style={{ color: 'var(--accent-emerald)' }}>Optimal choice</td>
              <td>—</td>
            </tr>
            {analysis.alternatives.map((alt, i) => (
              <tr key={i}>
                <td>{alt.name}</td>
                <td className="font-mono">{alt.time_complexity}</td>
                <td className="font-mono">{alt.space_complexity}</td>
                <td style={{ color: 'var(--accent-emerald)', fontSize: '12px' }}>{alt.pros?.join(', ')}</td>
                <td style={{ color: 'var(--accent-rose)', fontSize: '12px' }}>{alt.cons?.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderVisualizationPanel = () => {
    if (!analysis) return (
      <div className="empty-state">
        <div className="empty-state-icon"><Icon name="visualization" size={48} /></div>
        <div className="empty-state-title">No visualization yet</div>
        <div className="empty-state-desc">Analyze a problem to see algorithm visualization.</div>
      </div>
    );

    const data = generateVizData();
    const maxVal = Math.max(...data);
    const barWidth = Math.floor(100 / data.length);

    const activeIdx = vizStep % data.length;
    return (
      <div className="slide-in">
        <div className="analysis-section-title mb-3">
          <Icon name="visualization" size={16} style={{ marginRight: 8 }} /> {analysis.selected_algorithm?.name} — Step-by-Step
        </div>
        <div className="viz-container" style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          gap: '6px', padding: '24px 20px 0',
        }}>
          {data.map((val, i) => {
            const isActive  = i === activeIdx;
            const isPassed  = i < activeIdx;
            const barH = Math.round((val / maxVal) * 190 + 36);
            const bg = isActive
              ? 'linear-gradient(to top, hsl(248,76%,36%), hsl(258,68%,62%))'
              : isPassed
                ? 'linear-gradient(to top, hsl(158,66%,32%), hsl(158,60%,52%))'
                : 'linear-gradient(to top, hsl(238,22%,24%), hsl(238,20%,32%))';
            return (
              <div key={i} className="viz-bar" style={{
                width: `${barWidth}%`,
                maxWidth: '60px',
                height: `${barH}px`,
                background: bg,
                border: isActive ? '2px solid hsl(258,68%,70%)' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isActive ? '0 0 20px rgba(140,100,240,0.45)' : 'none',
                minHeight: '28px',
                position: 'relative',
              }}>
                <div className="viz-bar-value">{val}</div>
              </div>
            );
          })}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '6px',
          padding: '0 20px 14px',
        }}>
          {data.map((_, i) => (
            <div key={i} style={{
              width: `${barWidth}%`, maxWidth: '60px',
              textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.35)',
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
              color: i === activeIdx ? 'hsl(258,68%,78%)' : 'rgba(255,255,255,0.28)',
            }}>i={i}</div>
          ))}
        </div>
        <div className="viz-controls">
          <button className="btn btn-sm btn-secondary" onClick={() => setVizStep(Math.max(0, vizStep - 1))}>
            <Icon name="chevronLeft" size={14} style={{ marginRight: 6 }} /> Prev
          </button>
          <button className="btn btn-sm btn-primary" onClick={() => {
            if (vizPlaying) {
              clearInterval(vizInterval.current);
              setVizPlaying(false);
            } else {
              setVizPlaying(true);
              vizInterval.current = setInterval(() => {
                setVizStep(s => (s + 1) % (data.length + 1));
              }, 800);
            }
          }}>
            {vizPlaying ? <><Icon name="pause" size={14} style={{ marginRight: 6 }} /> Pause</> : <><Icon name="play" size={14} style={{ marginRight: 6 }} /> Play</>}
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => setVizStep(vizStep + 1)}>
            Next <Icon name="chevronRight" size={14} style={{ marginLeft: 6 }} />
          </button>
          <button className="btn btn-sm btn-ghost" onClick={() => { setVizStep(0); setVizPlaying(false); clearInterval(vizInterval.current); }}>
            <Icon name="undo" size={14} style={{ marginRight: 6 }} /> Reset
          </button>
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
            step {activeIdx + 1} / {data.length}
          </div>
        </div>
      </div>
    );
  };

  const renderHintCard = (hint, level, isCollapsed = false) => {
    // Support both new structured format and legacy plain-text fallback
    const isStructured = hint && typeof hint === 'object' && hint.title;
    const levelColors = [
      { accent: 'var(--accent-emerald)',  bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.22)'  }, // L1 Nudge
      { accent: 'var(--accent-blue)',     bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.22)'  }, // L2 Direction
      { accent: 'var(--accent-amber)',    bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.22)'  }, // L3 Approach
      { accent: 'var(--accent-violet)',   bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.22)'  }, // L4 Pseudocode
      { accent: 'var(--accent-rose)',     bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.22)'   }, // L5 Solution
    ];
    const lc = levelColors[(level - 1)] || levelColors[0];

    if (!isStructured) {
      // Legacy plain-text fallback
      return (
        <div className="hint-content" style={{ borderLeft: `3px solid ${lc.accent}` }}>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: 1.85 }}>{typeof hint === 'string' ? hint : JSON.stringify(hint)}</div>
        </div>
      );
    }

    return (
      <div className="hint-card-structured slide-in">
        {/* ─ Header ─ */}
        <div className="hint-card-header" style={{ borderLeft: `4px solid ${lc.accent}`, background: lc.bg, borderTopColor: lc.border, borderRightColor: lc.border, borderBottomColor: lc.border }}>
          <div className="hint-card-level-badge" style={{ background: lc.accent }}>
            Level {level} · {hint.level_name}
          </div>
          <div className="hint-card-title">{hint.title}</div>
        </div>

        {/* ─ Explanation ─ */}
        {hint.explanation && (
          <div className="hint-card-explanation">
            <p style={{ margin: 0, lineHeight: 1.85, fontSize: '14px', color: 'var(--text-primary)' }}>
              {hint.explanation}
            </p>
          </div>
        )}

        {/* ─ Steps ─ */}
        {hint.steps?.length > 0 && (
          <div className="hint-card-steps">
            <div className="hint-card-section-label">
              <Icon name="bolt" size={12} style={{ marginRight: 6 }} /> Step-by-Step Breakdown
            </div>
            <ol className="hint-steps-list">
              {hint.steps.map((step, i) => (
                <li key={i} className="hint-step-item">
                  <div className="hint-step-number" style={{ background: lc.accent }}>{i + 1}</div>
                  <div className="hint-step-text">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ─ Key Insight ─ */}
        {hint.key_insight && (
          <div className="hint-key-insight" style={{ borderColor: lc.border, background: lc.bg }}>
            <div className="hint-key-insight-label" style={{ color: lc.accent }}>
              <Icon name="sparkles" size={13} style={{ marginRight: 6 }} /> Key Insight
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.7 }}>
              {hint.key_insight}
            </p>
          </div>
        )}

        {/* ─ Code / Pseudocode Block ─ */}
        {hint.code_snippet && (
          <div className="hint-code-block">
            <div className="hint-code-header">
              <div className="editor-dots">
                <div className="editor-dot editor-dot-red" />
                <div className="editor-dot editor-dot-amber" />
                <div className="editor-dot editor-dot-green" />
              </div>
              <span className="code-block-lang" style={{ color: lc.accent }}>
                {level === 4 ? 'Pseudocode' : 'Python'}
              </span>
              <button
                className="copy-btn"
                style={{ marginLeft: 'auto' }}
                onClick={() => navigator.clipboard.writeText(hint.code_snippet)}
              >
                <Icon name="copy" size={12} style={{ marginRight: 5 }} /> Copy
              </button>
            </div>
            <SyntaxHighlighter
              language={level === 4 ? 'text' : 'python'}
              style={vscDarkPlus}
              customStyle={{
                background: 'var(--bg-code)',
                margin: 0,
                padding: '18px 20px',
                fontSize: '13px',
                lineHeight: '1.75',
                maxHeight: '480px',
              }}
              showLineNumbers={level === 5}
            >
              {hint.code_snippet}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    );
  };

  const renderHintsPanel = () => {
    if (!analysis) return (
      <div className="empty-state">
        <div className="empty-state-icon"><Icon name="hints" size={48} /></div>
        <div className="empty-state-title">Hints available after analysis</div>
        <div className="empty-state-desc">Get progressive hints from subtle nudge to full solution.</div>
      </div>
    );

    return (
      <div className="slide-in">
        {/* Intro */}
        <p className="text-secondary text-sm mb-4" style={{ lineHeight: 1.75 }}>
          Unlock hints progressively — from a gentle nudge all the way to a full solution walkthrough.
          Each level reveals more detail, including steps, key insights, and code.
        </p>

        {/* Connected step track */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '28px', position: 'relative' }}>
          {[1, 2, 3, 4, 5].map((level, idx) => {
            const isUnlocked = !!hints[level];
            const isCurrent  = level === currentHintLevel;
            const isLocked   = level > currentHintLevel + 1;
            const cls = isCurrent ? 'current' : isUnlocked ? 'unlocked' : isLocked ? 'locked' : '';
            return (
              <div key={level} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {idx < 4 && (
                  <div style={{
                    position: 'absolute', top: '22px', left: '50%',
                    width: '100%', height: '2px', zIndex: 0,
                    background: isUnlocked ? 'var(--gradient-primary)' : 'var(--border-medium)',
                    transition: 'background 0.4s ease',
                  }} />
                )}
                <button
                  className={`hint-level-btn ${cls}`}
                  onClick={() => handleGetHint(level)}
                  disabled={isLocked || isLoadingHint}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  {isUnlocked && !isCurrent ? <Icon name="star" size={14} /> : level}
                </button>
                <div className="hint-step-label">{HINT_LABELS[level - 1]}</div>
              </div>
            );
          })}
        </div>

        {isLoadingHint && (
          <div className="loader"><div className="spinner" /> Generating hint...</div>
        )}

        {/* Current hint — full rich display */}
        {currentHintLevel > 0 && hints[currentHintLevel] && !isLoadingHint && (
          <div className="mb-4">
            {renderHintCard(hints[currentHintLevel], currentHintLevel)}
          </div>
        )}

        {/* Previous hints — collapsed summary rows */}
        {currentHintLevel > 1 && (
          <div className="mt-4">
            <div className="analysis-section-title mb-3">
              <Icon name="document" size={13} style={{ marginRight: 6 }} /> Previous Hints
            </div>
            {Object.entries(hints)
              .filter(([lvl]) => Number(lvl) < currentHintLevel)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([lvl, hint]) => {
                const levelColors = [
                  { accent: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.06)' },
                  { accent: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.06)' },
                  { accent: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.06)' },
                  { accent: 'var(--accent-violet)', bg: 'rgba(139,92,246,0.06)' },
                ];
                const lc = levelColors[(Number(lvl) - 1)] || levelColors[0];
                const isStructured = hint && typeof hint === 'object' && hint.title;
                return (
                  <div key={lvl} className="hint-prev-row" style={{ borderLeft: `3px solid ${lc.accent}`, background: lc.bg }}>
                    <div className="hint-prev-row-header">
                      <span className="hint-prev-level-tag" style={{ color: lc.accent }}>
                        L{lvl} · {HINT_LABELS[Number(lvl) - 1]}
                      </span>
                      {isStructured && (
                        <span className="hint-prev-title">{hint.title}</span>
                      )}
                      <button
                        className="btn btn-sm btn-ghost"
                        style={{ marginLeft: 'auto', padding: '3px 10px', fontSize: '11px' }}
                        onClick={() => setCurrentHintLevel(Number(lvl))}
                      >
                        View
                      </button>
                    </div>
                    {isStructured && hint.key_insight && (
                      <p className="hint-prev-insight">{hint.key_insight}</p>
                    )}
                  </div>
                );
              })
            }
          </div>
        )}
      </div>
    );
  };


  const renderInterviewPanel = () => {
    if (!analysis?.interview_questions?.length) return (
      <div className="empty-state">
        <div className="empty-state-icon"><Icon name="interview" size={48} /></div>
        <div className="empty-state-title">Interview questions after analysis</div>
        <div className="empty-state-desc">Practice with AI-generated interview questions.</div>
      </div>
    );

    return (
      <div className="slide-in">
        <p className="text-secondary text-sm mb-4">
          Practice these questions to prepare for technical interviews.
        </p>
        {analysis.interview_questions.map((q, i) => (
          <div key={i} className="interview-card">
            <div className="interview-category">{q.category?.replace('_', ' ')}</div>
            <div className="interview-question">{q.question}</div>
            <button
              className="interview-toggle"
              onClick={() => setExpandedQuestions(prev => ({ ...prev, [i]: !prev[i] }))}
            >
              {expandedQuestions[i] ? <><Icon name="chevronUp" size={12} style={{ marginRight: 4 }} /> Hide Answer</> : <><Icon name="chevronDown" size={12} style={{ marginRight: 4 }} /> Show Answer</>}
            </button>
            {expandedQuestions[i] && (
              <div className="interview-answer mt-2">
                {q.expected_answer}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderReviewPanel = () => (
    <div className="slide-in">
      <p className="text-secondary text-sm mb-4">
        Paste your solution code below and get AI-powered feedback on correctness, efficiency, and quality.
      </p>
      <textarea
        className="textarea"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', minHeight: '200px' }}
        placeholder="Paste your solution code here..."
        value={userCode}
        onChange={e => setUserCode(e.target.value)}
      />
      <div className="mt-3">
        <button
          className="btn btn-primary"
          onClick={handleReview}
          disabled={isReviewing || !userCode.trim() || !analysis}
        >
          {isReviewing ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Reviewing...</> : <><Icon name="review" size={16} style={{ marginRight: 8 }} /> Review My Code</>}
        </button>
      </div>

      {review && (
        <div className="mt-4 slide-in">
          <div className="review-score-circle">{review.overall_score}</div>
          <div className="text-center text-muted text-sm mb-4">Overall Score</div>

          <div className="stats-grid mb-4">
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '20px' }}>{review.correctness?.score || 0}</div>
              <div className="stat-label">Correctness</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '20px' }}>{review.quality?.score || 0}</div>
              <div className="stat-label">Quality</div>
            </div>
          </div>

          {/* Efficiency */}
          <div className="card mb-3">
            <div className="analysis-section-title"><Icon name="bolt" size={16} style={{ marginRight: 8 }} /> Efficiency</div>
            <div className="complexity-display">
              <div className="complexity-item">
                <div className="complexity-label">Your Time</div>
                <div className="complexity-value" style={{ fontSize: '18px' }}>{review.efficiency?.current_time}</div>
              </div>
              <div className="complexity-item">
                <div className="complexity-label">Optimal</div>
                <div className="complexity-value" style={{ fontSize: '18px', color: 'var(--accent-emerald)' }}>{review.efficiency?.optimal_time}</div>
              </div>
            </div>
            {review.efficiency?.suggestions?.length > 0 && (
              <div className="mt-3">
                {review.efficiency.suggestions.map((s, i) => (
                  <div key={i} className="text-secondary text-sm" style={{ padding: '4px 0' }}>
                    <Icon name="hints" size={14} style={{ marginRight: 6, color: 'var(--accent-purple-light)' }} /> {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card">
            <div className="analysis-section-title"><Icon name="document" size={16} style={{ marginRight: 8 }} /> Summary</div>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.8 }}>{review.summary}</p>
          </div>

          {/* Optimized Code */}
          {review.optimized_code && (
            <div className="mt-3">
              <div className="analysis-section-title"><Icon name="sparkles" size={16} style={{ marginRight: 8 }} /> Optimized Version</div>
              <div className="code-block">
                <div className="code-block-header">
                  <span className="code-block-lang">Optimized</span>
                  <button className="copy-btn" onClick={() => copyCode(review.optimized_code)}><Icon name="copy" size={14} style={{ marginRight: 6 }} /> Copy</button>
                </div>
                <SyntaxHighlighter language="python" style={vscDarkPlus}
                  customStyle={{ background: 'var(--bg-code)', margin: 0, padding: '16px', fontSize: '13px' }}>
                  {review.optimized_code}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderVivaPanel = () => (
    <div className="slide-in">
      <p className="text-secondary text-sm mb-4">
        AI-generated viva questions to test your deep understanding.
      </p>
      {!vivaQuestions ? (
        <div className="text-center" style={{ padding: '40px' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleGenerateViva}
            disabled={isGeneratingViva || !analysis}
          >
            {isGeneratingViva ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating...</> : <><Icon name="viva" size={18} style={{ marginRight: 8 }} /> Generate Viva Questions</>}
          </button>
          {!analysis && <p className="text-muted text-sm mt-3">Analyze a problem first</p>}
        </div>
      ) : (
        vivaQuestions.map((q, i) => (
          <div key={i} className="viva-question-card">
            <div className={`viva-difficulty ${q.difficulty}`}>{q.difficulty} · {q.topic}</div>
            <div className="interview-question">{q.question}</div>
            <button
              className="interview-toggle"
              onClick={() => setExpandedQuestions(prev => ({ ...prev, [`v${i}`]: !prev[`v${i}`] }))}
            >
              {expandedQuestions[`v${i}`] ? <><Icon name="chevronUp" size={12} style={{ marginRight: 4 }} /> Hide Answer</> : <><Icon name="chevronDown" size={12} style={{ marginRight: 4 }} /> Show Model Answer</>}
            </button>
            {expandedQuestions[`v${i}`] && (
              <div className="interview-answer mt-2">{q.expected_answer}</div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="slide-in">
      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-value">{stats.totalProblems}</div>
          <div className="stat-label">Problems Analyzed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.keys(stats.paradigms).length}</div>
          <div className="stat-label">Paradigms Explored</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.difficulties.easy}</div>
          <div className="stat-label">Easy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.difficulties.medium}</div>
          <div className="stat-label">Medium</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.difficulties.hard}</div>
          <div className="stat-label">Hard</div>
        </div>
      </div>

      {Object.keys(stats.paradigms).length > 0 && (() => {
        const CHART_COLORS = [
          { bg: 'linear-gradient(135deg, #7B6AE8, #9B8EF0)', solid: '#7B6AE8' },
          { bg: 'linear-gradient(135deg, #10B981, #34D399)', solid: '#10B981' },
          { bg: 'linear-gradient(135deg, #F59E0B, #FBBF24)', solid: '#F59E0B' },
          { bg: 'linear-gradient(135deg, #EF4444, #F87171)', solid: '#EF4444' },
          { bg: 'linear-gradient(135deg, #3B82F6, #60A5FA)', solid: '#3B82F6' },
          { bg: 'linear-gradient(135deg, #EC4899, #F472B6)', solid: '#EC4899' },
          { bg: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', solid: '#8B5CF6' },
          { bg: 'linear-gradient(135deg, #14B8A6, #5EEAD4)', solid: '#14B8A6' },
        ];
        const sorted = Object.entries(stats.paradigms).sort(([, a], [, b]) => b - a);
        const total = sorted.reduce((s, [, c]) => s + c, 0);
        const size = 220;
        const strokeWidth = 32;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        let accumulated = 0;

        return (
          <div className="card paradigm-chart-card">
            <div className="analysis-section-title mb-3">
              <Icon name="visualization" size={16} style={{ marginRight: 8 }} /> Paradigm Distribution
            </div>
            <div className="paradigm-chart-wrapper">
              {/* Donut Chart */}
              <div className="paradigm-donut-container">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="paradigm-donut-svg">
                  {/* Background ring */}
                  <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="var(--bg-tertiary)" strokeWidth={strokeWidth}
                    opacity="0.5"
                  />
                  {/* Segments */}
                  {sorted.map(([paradigm, count], i) => {
                    const pct = count / total;
                    const dashLen = circumference * pct;
                    const gap = circumference - dashLen;
                    const offset = -circumference * accumulated + circumference * 0.25;
                    accumulated += pct;
                    const color = CHART_COLORS[i % CHART_COLORS.length];
                    return (
                      <circle
                        key={paradigm}
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke={color.solid}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${dashLen} ${gap}`}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="paradigm-segment"
                        style={{
                          filter: `drop-shadow(0 0 6px ${color.solid}44)`,
                          animation: `paradigmSegmentIn 0.8s ease-out ${i * 0.12}s both`,
                        }}
                      />
                    );
                  })}
                </svg>
                {/* Center label */}
                <div className="paradigm-donut-center">
                  <div className="paradigm-donut-total">{total}</div>
                  <div className="paradigm-donut-label">Solved</div>
                </div>
              </div>

              {/* Legend */}
              <div className="paradigm-legend">
                {sorted.map(([paradigm, count], i) => {
                  const color = CHART_COLORS[i % CHART_COLORS.length];
                  const pct = ((count / total) * 100).toFixed(0);
                  return (
                    <div key={paradigm} className="paradigm-legend-item">
                      <div className="paradigm-legend-dot" style={{ background: color.solid, boxShadow: `0 0 8px ${color.solid}55` }} />
                      <div className="paradigm-legend-info">
                        <span className="paradigm-legend-name">{paradigm}</span>
                        <span className="paradigm-legend-stats">{count} · {pct}%</span>
                      </div>
                      <div className="paradigm-legend-bar-track">
                        <div
                          className="paradigm-legend-bar-fill"
                          style={{
                            width: `${pct}%`,
                            background: color.bg,
                            animation: `paradigmBarGrow 0.6s ease-out ${i * 0.1}s both`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── AI Insights Section ─── */}
      <div className="card insights-card">
        <div className="insights-header">
          <div className="analysis-section-title mb-0">
            <Icon name="brain" size={16} style={{ marginRight: 8 }} /> AI Insights & Recommendations
          </div>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleGetInsights}
            disabled={isLoadingInsights || stats.totalProblems === 0}
          >
            {isLoadingInsights
              ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Analyzing...</>
              : <><Icon name="sparkles" size={14} style={{ marginRight: 6 }} /> {insights ? 'Refresh' : 'Generate'}</>}
          </button>
        </div>

        {!insights && !isLoadingInsights && (
          <div className="insights-empty">
            <Icon name="brain" size={40} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <p className="text-muted text-sm" style={{ marginTop: 12 }}>
              {stats.totalProblems === 0
                ? 'Analyze at least one problem to unlock personalized AI insights.'
                : 'Click "Generate" to get AI-powered analysis of your strengths, weaknesses, and what to practice next.'}
            </p>
          </div>
        )}

        {isLoadingInsights && (
          <div className="loader" style={{ padding: '40px 20px' }}>
            <div className="spinner" /> Analyzing your practice patterns...
          </div>
        )}

        {insights && !isLoadingInsights && (
          <div className="insights-content slide-in">
            {/* Motivation Banner */}
            <div className="insights-motivation">
              <Icon name="sparkles" size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
              <p>{insights.motivation}</p>
            </div>

            {/* Skill Level + Score */}
            <div className="insights-skill-row">
              <div className="insights-skill-ring-container">
                <svg width={100} height={100} viewBox="0 0 100 100" className="insights-skill-ring">
                  <circle cx={50} cy={50} r={42} fill="none" stroke="var(--bg-tertiary)" strokeWidth={8} opacity={0.5} />
                  <circle
                    cx={50} cy={50} r={42}
                    fill="none"
                    stroke={insights.skill_level === 'advanced' ? '#10B981' : insights.skill_level === 'intermediate' ? '#F59E0B' : '#3B82F6'}
                    strokeWidth={8}
                    strokeDasharray={`${2 * Math.PI * 42 * (insights.skill_score / 100)} ${2 * Math.PI * 42 * (1 - insights.skill_score / 100)}`}
                    strokeDashoffset={2 * Math.PI * 42 * 0.25}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${insights.skill_level === 'advanced' ? '#10B98144' : insights.skill_level === 'intermediate' ? '#F59E0B44' : '#3B82F644'})` }}
                  />
                </svg>
                <div className="insights-skill-ring-label">
                  <div className="insights-skill-ring-value">{insights.skill_score}</div>
                </div>
              </div>
              <div className="insights-skill-info">
                <div className="insights-skill-level-badge" style={{
                  background: insights.skill_level === 'advanced' ? 'rgba(16,185,129,0.12)' : insights.skill_level === 'intermediate' ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.12)',
                  color: insights.skill_level === 'advanced' ? '#10B981' : insights.skill_level === 'intermediate' ? '#F59E0B' : '#3B82F6',
                }}>
                  {insights.skill_level?.charAt(0).toUpperCase() + insights.skill_level?.slice(1)}
                </div>
                <p className="text-secondary text-sm" style={{ marginTop: 6, lineHeight: 1.6 }}>{insights.difficulty_advice}</p>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="insights-sw-grid">
              {/* Strengths */}
              <div className="insights-sw-card insights-strengths">
                <div className="insights-sw-title">
                  <Icon name="trophy" size={14} style={{ marginRight: 6, color: 'var(--accent-emerald)' }} /> Strengths
                </div>
                {insights.strengths?.length > 0 ? insights.strengths.map((s, i) => (
                  <div key={i} className="insights-sw-item">
                    <span className="insights-sw-paradigm">{s.paradigm}</span>
                    <span className="insights-sw-msg">{s.message}</span>
                  </div>
                )) : <p className="text-muted text-sm">Keep practicing to discover your strengths!</p>}
              </div>
              {/* Weaknesses */}
              <div className="insights-sw-card insights-weaknesses">
                <div className="insights-sw-title">
                  <Icon name="target" size={14} style={{ marginRight: 6, color: 'var(--accent-amber)' }} /> Areas to Improve
                </div>
                {insights.weaknesses?.length > 0 ? insights.weaknesses.map((w, i) => (
                  <div key={i} className="insights-sw-item">
                    <span className="insights-sw-paradigm">{w.paradigm}</span>
                    <span className="insights-sw-msg">{w.message}</span>
                  </div>
                )) : <p className="text-muted text-sm">No weak areas detected yet — great job!</p>}
              </div>
            </div>

            {/* Next Challenge */}
            {insights.next_challenge && (
              <div className="insights-next-challenge">
                <div className="insights-next-challenge-header">
                  <Icon name="rocket" size={16} style={{ marginRight: 8 }} />
                  <span>Recommended Next Challenge</span>
                </div>
                <div className="insights-next-challenge-body">
                  <div className="insights-next-meta">
                    <span className={`badge badge-${insights.next_challenge.difficulty}`}>{insights.next_challenge.difficulty}</span>
                    <span className="badge badge-paradigm">{insights.next_challenge.paradigm}</span>
                  </div>
                  <p className="text-secondary text-sm" style={{ marginTop: 8, lineHeight: 1.6 }}>{insights.next_challenge.reason}</p>
                  {insights.next_challenge.example_problem && (
                    <div className="insights-example-problem">
                      <Icon name="document" size={13} style={{ marginRight: 6, flexShrink: 0 }} />
                      <span>{insights.next_challenge.example_problem}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Focus Areas */}
            {insights.focus_areas?.length > 0 && (
              <div className="insights-focus">
                <div className="analysis-section-title mb-2">
                  <Icon name="bolt" size={14} style={{ marginRight: 6 }} /> Focus Areas
                </div>
                {insights.focus_areas.map((f, i) => (
                  <div key={i} className="insights-focus-item">
                    <div className={`insights-focus-priority priority-${f.priority}`}>{f.priority}</div>
                    <div className="insights-focus-info">
                      <span className="insights-focus-area">{f.area}</span>
                      <span className="insights-focus-tip">{f.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Missing Paradigms */}
            {insights.missing_paradigms?.length > 0 && (
              <div className="insights-missing">
                <div className="analysis-section-title mb-2">
                  <Icon name="tag" size={14} style={{ marginRight: 6 }} /> Unexplored Paradigms
                </div>
                <div className="insights-missing-tags">
                  {insights.missing_paradigms.map((p, i) => (
                    <span key={i} className="tag insights-missing-tag">{p}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'analysis': return renderAnalysisPanel();
      case 'code': return renderCodePanel();
      case 'complexity': return renderComplexityPanel();
      case 'alternatives': return renderAlternativesPanel();
      case 'visualization': return renderVisualizationPanel();
      case 'hints': return renderHintsPanel();
      case 'interview': return renderInterviewPanel();
      case 'review': return renderReviewPanel();
      case 'viva': return renderVivaPanel();
      case 'dashboard': return renderDashboard();
      default: return renderAnalysisPanel();
    }
  };

  if (!mounted) {
    return (
      <div className="loader" style={{ height: '100vh', flexDirection: 'column' }}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
        <div className="text-muted mt-3" style={{ fontSize: '14px', fontWeight: 500 }}>Loading Cognit...</div>
      </div>
    );
  }

  return (
    <>
      {/* ─── Header ─── */}
      <header className="header">
        <div className="flex items-center gap-3">
          {analysis && (
            <button className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ border: 'none', background: 'transparent' }}>
              <Icon name="menu" size={18} />
            </button>
          )}
          <div className="header-logo">
            <div className="header-logo-icon"><Icon name="sparkles" size={18} /></div>
            Cognit
          </div>
          {analysis && (
            <span className="badge badge-paradigm" style={{ marginLeft: '12px' }}>
              {analysis.classification?.primary_paradigm_label}
            </span>
          )}
        </div>
        <div className="header-actions">
          {isAnalyzing && <div className="flex items-center gap-2 text-sm text-muted"><div className="pulse-dot" /> Analyzing...</div>}
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
          </button>
          <button className="btn-icon" onClick={() => setSettingsOpen(true)} title="Settings"><Icon name="settings" size={18} /></button>
        </div>
      </header>

      {/* ─── Settings Modal ─── */}
      {settingsOpen && (
        <div className="modal-overlay" onClick={() => apiKey && setSettingsOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title"><Icon name="settings" size={20} style={{ marginRight: 8 }} /> Settings</div>
            <div className="modal-desc">Enter your Gemini API key to power Cognit's AI features. Your key is stored locally and never sent to our servers.</div>
            <label className="text-xs font-bold text-muted" style={{ letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Gemini API Key
            </label>
            <input
              type="password"
              className="input mb-4"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={e => {
                const val = e.target.value.trim();
                setApiKey(val);
                localStorage.setItem('algomind_gemini_api_key', val);
              }}
            />
            <label className="text-xs font-bold text-muted" style={{ letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Gemini Model Selection
            </label>
            <select
              className="input mb-4"
              value={model}
              onChange={e => {
                setModel(e.target.value);
                localStorage.setItem('algomind_gemini_model', e.target.value);
              }}
              style={{ appearance: 'none', background: 'var(--bg-input)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <option value="gemini-3.5-flash" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>Gemini 3.5 Flash (Default)</option>
              <option value="gemini-3.1-flash-lite" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>Gemini 3.1 Flash-Lite (Fast & Light)</option>
              <option value="gemini-3.1-pro" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>Gemini 3.1 Pro (Higher Reasoning)</option>
            </select>
            <button className="btn btn-primary w-full" onClick={() => setSettingsOpen(false)} disabled={!apiKey}>
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {/* ─── Layout ─── */}
      <div className="app-layout">
        {/* Sidebar — only show when analysis exists */}
        {analysis && sidebarOpen && (
          <aside className="sidebar">
            <div className="sidebar-section-title">Results</div>
            {PANELS.filter(p => p.section === 'results').map(p => (
              <div
                key={p.id}
                className={`sidebar-item ${activePanel === p.id ? 'active' : ''}`}
                onClick={() => setActivePanel(p.id)}
              >
                <Icon name={p.icon} className="sidebar-icon" size={18} />
                {p.label}
              </div>
            ))}

            <div className="sidebar-section-title">Learn</div>
            {PANELS.filter(p => p.section === 'learn').map(p => (
              <div
                key={p.id}
                className={`sidebar-item ${activePanel === p.id ? 'active' : ''}`}
                onClick={() => setActivePanel(p.id)}
              >
                <Icon name={p.icon} className="sidebar-icon" size={18} />
                {p.label}
              </div>
            ))}

            <div className="sidebar-section-title">Track</div>
            {PANELS.filter(p => p.section === 'track').map(p => (
              <div
                key={p.id}
                className={`sidebar-item ${activePanel === p.id ? 'active' : ''}`}
                onClick={() => setActivePanel(p.id)}
              >
                <Icon name={p.icon} className="sidebar-icon" size={18} />
                {p.label}
              </div>
            ))}

            {/* Quick Stats */}
            <div style={{ marginTop: 'auto', padding: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <div className="text-xs text-muted mb-2" style={{ fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Quick Stats</div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-secondary">Analyzed</span>
                <span className="font-bold">{stats.totalProblems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Paradigms</span>
                <span className="font-bold">{Object.keys(stats.paradigms).length}</span>
              </div>
            </div>
          </aside>
        )}

        {/* ─── Screen 1: Problem Input (full-width, centered) ─── */}
        {!analysis && (
          <main className={`main-content sidebar-closed ${screenTransition}`}>
            <div className="problem-input-screen">
              <div className="animated-bg">
                <div className="dot-grid" />
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
              </div>
              <div className="problem-input-container">
                <div className="problem-input-hero">
                  <div className="tagline-badge"><Icon name="sparkles" size={12} style={{ marginRight: 6 }} /> Intelligent Algorithm Co-Pilot</div>
                  <h1 className="problem-input-hero-title">What problem do you want to solve?</h1>
                  <p className="problem-input-hero-desc">Paste any algorithm problem and Cognit will classify it, select the optimal algorithm, and generate a complete learning package.</p>
                </div>

                <div className="problem-input-card">
                  {/* macOS-style editor title bar */}
                  <div className="editor-title-bar">
                    <div className="editor-dots">
                      <div className="editor-dot editor-dot-red" />
                      <div className="editor-dot editor-dot-amber" />
                      <div className="editor-dot editor-dot-green" />
                    </div>
                    <span className="editor-title-label">problem.txt — Cognit Editor</span>
                  </div>
                  <div className="editor-body">
                    <textarea
                      className="textarea"
                      placeholder={"Paste your algorithm problem here...\n\nExample: Given an array of integers, find two numbers that add up to a target sum."}
                      value={problem}
                      onChange={e => setProblem(e.target.value)}
                      style={{ minHeight: '180px', fontSize: '14.5px' }}
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        className="btn btn-primary flex-1"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !problem.trim()}
                      >
                        {isAnalyzing ? (
                          <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Analyzing...</>
                        ) : <><Icon name="rocket" size={16} style={{ marginRight: 8 }} /> Analyze Problem</>}
                      </button>
                      <button className="btn btn-secondary" onClick={() => {
                        setProblem(''); setError('');
                      }}>
                        ↺ Clear
                      </button>
                    </div>
                    {renderErrorAlert()}
                  </div>
                </div>

                <div className="problem-input-examples">
                  <div className="example-problems-header">Or try an example</div>
                  <div className="example-problems-grid">
                    {EXAMPLE_PROBLEMS.map((ex, i) => (
                      <div key={i} className="example-problem-item" onClick={() => selectExample(ex)}>
                        <Icon name="arrowRight" size={14} style={{ color: 'var(--accent-purple-light)', flexShrink: 0 }} />
                        {ex.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ─── Screen 2: Results (full-width with problem banner) ─── */}
        {analysis && (
          <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''} ${screenTransition}`}>
            {/* Problem Statement Banner */}
            <div className="problem-banner">
              <div className="problem-banner-left">
                <div className="problem-banner-label"><Icon name="document" size={14} style={{ marginRight: 6 }} /> Problem</div>
                <div className="problem-banner-text">{problem}</div>
              </div>
              <div className="problem-banner-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => {
                  triggerTransition(() => {
                    setAnalysis(null); setGeneratedCode({});
                    setHints({}); setCurrentHintLevel(0); setReview(null);
                    setVivaQuestions(null); setError('');
                  });
                }}>
                  <Icon name="pencil" size={12} style={{ marginRight: 6 }} /> New Problem
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="results-screen">
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    {PANELS.find(p => p.id === activePanel) && (
                      <Icon name={PANELS.find(p => p.id === activePanel).icon} size={16} style={{ marginRight: 8 }} />
                    )}
                    {PANELS.find(p => p.id === activePanel)?.label}
                  </div>
                  {analysis && activePanel === 'code' && !generatedCode[selectedLanguage] && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleGenerateCode(selectedLanguage)}>
                      Generate
                    </button>
                  )}
                </div>
                <div className="panel-body">
                  {renderErrorAlert()}
                  {renderActivePanel()}
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </>
  );
}
