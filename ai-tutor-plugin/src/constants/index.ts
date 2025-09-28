// =============================================================================
// AI TUTOR PLUGIN - CONSTANTS
// =============================================================================

import { 
  TrendingUp, 
  Zap, 
  Calculator, 
  Beaker, 
  BookOpen, 
  Lightbulb,
  Atom,
  Globe,
  Code,
  History
} from 'lucide-react';

// Default Topics Configuration
export const DEFAULT_TOPICS = [
  {
    id: "probability",
    name: "Probability",
    path: "notes/content/mathematics/probability",
    icon: TrendingUp,
    description: "Probability theory, conditional probability, and statistics"
  },
  {
    id: "functions",
    name: "Functions",
    path: "notes/content/mathematics/functions",
    icon: Zap,
    description: "Mathematical functions, calculus, and analysis"
  },
  {
    id: "physics",
    name: "Physics",
    path: "notes/content/physics/mechanics",
    icon: Atom,
    description: "Classical mechanics and quantum physics"
  },
  {
    id: "chemistry",
    name: "Chemistry",
    path: "notes/content/chemistry/organic",
    icon: Beaker,
    description: "Organic chemistry and chemical reactions"
  },
  {
    id: "programming",
    name: "Programming",
    path: "notes/content/computer-science/programming",
    icon: Code,
    description: "Programming concepts and algorithms"
  },
  {
    id: "history",
    name: "History",
    path: "notes/content/history/world",
    icon: History,
    description: "World history and historical events"
  },
  {
    id: "general",
    name: "General Knowledge",
    path: "notes/content/general/knowledge",
    icon: Globe,
    description: "General knowledge and trivia"
  }
];

// Quick Prompts for Common Questions
export const QUICK_PROMPTS = [
  {
    text: "Explain calculus derivatives",
    icon: Calculator,
    subject: "Math",
  },
  {
    text: "Help with chemistry equations",
    icon: Beaker,
    subject: "Chemistry",
  },
  {
    text: "Physics problem solving",
    icon: BookOpen,
    subject: "Physics",
  },
  {
    text: "Study tips and strategies",
    icon: Lightbulb,
    subject: "General",
  },
  {
    text: "Programming concepts",
    icon: Code,
    subject: "Programming",
  },
  {
    text: "Historical events",
    icon: History,
    subject: "History",
  }
];

// Default Configuration
export const DEFAULT_CONFIG = {
  maxMessages: 10,
  enableRAG: true,
  enableConversationHistory: true,
  enableMetadataTracking: true,
  enableDebugMode: false,
  defaultSystemPrompt: "You are an expert AI tutor. Provide clear, accurate, and educational explanations. Use the provided context and conversation history to give comprehensive answers.",
  apiTimeouts: {
    ragQuery: 30000,
    healthCheck: 10000,
    messageSend: 15000
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: "Failed to connect to AI tutor service",
  RAG_SYSTEM_OFFLINE: "RAG system is currently offline",
  INVALID_TOPIC: "Invalid topic selected",
  MESSAGE_TOO_LONG: "Message is too long",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded, please try again later",
  NETWORK_ERROR: "Network error occurred",
  UNKNOWN_ERROR: "An unknown error occurred"
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CONNECTION_ESTABLISHED: "Connected to AI tutor service",
  MESSAGE_SENT: "Message sent successfully",
  CONVERSATION_CREATED: "New conversation started",
  CONTEXT_LOADED: "Learning context loaded"
};

// UI Constants
export const UI_CONSTANTS = {
  TYPING_INDICATOR_DELAY: 1000,
  MESSAGE_ANIMATION_DURATION: 300,
  SCROLL_TO_BOTTOM_DELAY: 100,
  COPY_FEEDBACK_DURATION: 2000,
  CONNECTION_RETRY_DELAY: 5000
};

// Firebase Configuration Keys
export const FIREBASE_CONFIG_KEYS = [
  'apiKey',
  'authDomain', 
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
  'measurementId'
] as const;

// Topic Paths Mapping
export const TOPIC_PATHS: Record<string, string> = {
  'probability': 'notes/content/mathematics/probability',
  'functions': 'notes/content/mathematics/functions',
  'physics': 'notes/content/physics/mechanics',
  'chemistry': 'notes/content/chemistry/organic',
  'programming': 'notes/content/computer-science/programming',
  'history': 'notes/content/history/world',
  'general': 'notes/content/general/knowledge'
};

// Intent Detection Keywords
export const INTENT_KEYWORDS = {
  question: ['?', 'what', 'how', 'why', 'when', 'where', 'which', 'who'],
  help_request: ['help', 'stuck', 'confused', 'don\'t understand', 'can\'t figure out'],
  explanation: ['explain', 'understand', 'mean', 'definition', 'define'],
  example: ['example', 'show me', 'demonstrate', 'illustrate', 'instance'],
  urgent: ['urgent', 'asap', 'quickly', 'immediately', 'emergency'],
  important: ['important', 'soon', 'deadline', 'due', 'critical']
};

// Topic Keywords for Auto-detection
export const TOPIC_KEYWORDS = {
  'probability': ['probability', 'chance', 'likelihood', 'odds', 'random', 'statistics'],
  'functions': ['function', 'graph', 'equation', 'derivative', 'integral', 'calculus'],
  'calculus': ['calculus', 'derivative', 'integral', 'limit', 'continuous', 'differentiation'],
  'algebra': ['algebra', 'equation', 'solve', 'variable', 'polynomial', 'quadratic'],
  'statistics': ['statistics', 'mean', 'median', 'standard deviation', 'distribution', 'variance'],
  'physics': ['physics', 'force', 'energy', 'momentum', 'acceleration', 'velocity'],
  'chemistry': ['chemistry', 'molecule', 'atom', 'reaction', 'compound', 'element'],
  'programming': ['programming', 'code', 'algorithm', 'function', 'variable', 'loop'],
  'history': ['history', 'historical', 'event', 'war', 'revolution', 'ancient']
};

// System Prompts by Topic
export const SYSTEM_PROMPTS = {
  probability: "You are an expert AI tutor specializing in probability and statistics. Use the provided context and conversation history to give detailed, accurate, and educational explanations about probability concepts, conditional probability, and statistical analysis.",
  functions: "You are an expert AI tutor specializing in mathematical functions and calculus. Use the provided context and conversation history to give detailed, accurate, and educational explanations about functions, derivatives, integrals, and mathematical analysis.",
  physics: "You are an expert AI tutor specializing in physics. Use the provided context and conversation history to give detailed, accurate, and educational explanations about classical mechanics, quantum physics, and physical principles.",
  chemistry: "You are an expert AI tutor specializing in chemistry. Use the provided context and conversation history to give detailed, accurate, and educational explanations about chemical reactions, molecular structures, and chemical principles.",
  programming: "You are an expert AI tutor specializing in programming and computer science. Use the provided context and conversation history to give detailed, accurate, and educational explanations about programming concepts, algorithms, and software development.",
  history: "You are an expert AI tutor specializing in history. Use the provided context and conversation history to give detailed, accurate, and educational explanations about historical events, figures, and historical analysis.",
  general: "You are an expert AI tutor with broad knowledge across many subjects. Use the provided context and conversation history to give detailed, accurate, and educational explanations on any topic."
};

// Default Sample Messages
export const SAMPLE_MESSAGES = [
  {
    id: "1",
    content: "Hello! I'm your AI tutor. I'm here to help you learn and understand complex topics. What would you like to study today?",
    sender: "ai" as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
];

// API Endpoints
export const API_ENDPOINTS = {
  RAG_QUERY: 'ragQuery',
  TEST_EMBEDDINGS: 'testEmbeddings',
  HEALTH_CHECK: 'healthCheck'
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_RAG: true,
  ENABLE_CONVERSATION_HISTORY: true,
  ENABLE_METADATA_TRACKING: true,
  ENABLE_QUICK_PROMPTS: true,
  ENABLE_FILE_UPLOAD: false,
  ENABLE_DEBUG_MODE: false,
  ENABLE_ANALYTICS: true,
  ENABLE_ERROR_REPORTING: true
};
