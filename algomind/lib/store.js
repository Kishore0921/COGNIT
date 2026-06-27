// ============================================
// AlgoMind Ultra — Client State Store
// Simple state management with React context
// ============================================

'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  // API Key
  apiKey: '',
  
  // Current problem
  problem: '',
  
  // Analysis results
  analysis: null,
  isAnalyzing: false,
  
  // Generated code
  generatedCode: {},
  selectedLanguage: 'python',
  isGenerating: false,
  
  // Hints
  currentHintLevel: 0,
  hints: {},
  hintCooldown: 0,
  
  // Code review
  userCode: '',
  review: null,
  isReviewing: false,
  
  // Viva
  vivaQuestions: null,
  isGeneratingViva: false,
  
  // UI State
  activePanel: 'analysis', // analysis | code | visualization | complexity | interview | hints | alternatives | review | viva
  sidebarOpen: true,
  settingsOpen: false,
  
  // History (persisted to localStorage)
  history: [],
  stats: {
    totalProblems: 0,
    paradigms: {},
    difficulties: { easy: 0, medium: 0, hard: 0 },
    streak: 0,
    lastSolvedDate: null,
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'SET_PROBLEM':
      return { ...state, problem: action.payload };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_ANALYSIS':
      return { ...state, analysis: action.payload, isAnalyzing: false };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_GENERATED_CODE':
      return { 
        ...state, 
        generatedCode: { ...state.generatedCode, [action.language]: action.payload },
        isGenerating: false 
      };
    case 'SET_LANGUAGE':
      return { ...state, selectedLanguage: action.payload };
    case 'SET_HINT':
      return { 
        ...state, 
        hints: { ...state.hints, [action.level]: action.payload },
        currentHintLevel: action.level 
      };
    case 'SET_HINT_COOLDOWN':
      return { ...state, hintCooldown: action.payload };
    case 'SET_USER_CODE':
      return { ...state, userCode: action.payload };
    case 'SET_REVIEW':
      return { ...state, review: action.payload, isReviewing: false };
    case 'SET_REVIEWING':
      return { ...state, isReviewing: action.payload };
    case 'SET_VIVA':
      return { ...state, vivaQuestions: action.payload, isGeneratingViva: false };
    case 'SET_GENERATING_VIVA':
      return { ...state, isGeneratingViva: action.payload };
    case 'SET_ACTIVE_PANEL':
      return { ...state, activePanel: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'TOGGLE_SETTINGS':
      return { ...state, settingsOpen: !state.settingsOpen };
    case 'ADD_TO_HISTORY':
      return { 
        ...state, 
        history: [action.payload, ...state.history].slice(0, 50) 
      };
    case 'UPDATE_STATS':
      return { ...state, stats: { ...state.stats, ...action.payload } };
    case 'RESET_WORKSPACE':
      return { 
        ...state, 
        analysis: null, 
        generatedCode: {}, 
        hints: {}, 
        currentHintLevel: 0,
        review: null,
        vivaQuestions: null,
        userCode: '',
        activePanel: 'analysis'
      };
    case 'LOAD_PERSISTED':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    try {
      const apiKey = localStorage.getItem('algomind_gemini_api_key') || localStorage.getItem('algomind_api_key') || '';
      const history = JSON.parse(localStorage.getItem('algomind_history') || '[]');
      const stats = JSON.parse(localStorage.getItem('algomind_stats') || 'null');
      dispatch({ 
        type: 'LOAD_PERSISTED', 
        payload: { 
          apiKey, 
          history,
          ...(stats ? { stats } : {})
        } 
      });
    } catch (e) {
      console.error('Failed to load persisted data:', e);
    }
  }, []);

  // Persist API key
  useEffect(() => {
    if (state.apiKey) {
      localStorage.setItem('algomind_gemini_api_key', state.apiKey);
    }
  }, [state.apiKey]);

  // Persist history and stats
  useEffect(() => {
    localStorage.setItem('algomind_history', JSON.stringify(state.history));
    localStorage.setItem('algomind_stats', JSON.stringify(state.stats));
  }, [state.history, state.stats]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
