// =============================================================================
// DEBUG UTILITIES
// =============================================================================

let debugMode = false;

export function setDebugMode(enabled: boolean) {
  debugMode = enabled;
  if (debugMode) {
    console.log('🐛 AI Tutor Plugin Debug Mode: ENABLED');
  }
}

export function getDebugMode(): boolean {
  return debugMode;
}

export function debugLog(message: string, ...args: any[]) {
  if (debugMode) {
    console.log(`[AI-Tutor] ${message}`, ...args);
  }
}

export function debugError(message: string, error: any) {
  if (debugMode) {
    console.error(`[AI-Tutor] ${message}`, error);
  }
}

export function debugWarn(message: string, ...args: any[]) {
  if (debugMode) {
    console.warn(`[AI-Tutor] ${message}`, ...args);
  }
}
