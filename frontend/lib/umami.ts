// Umami Analytics tracking utilities
// Docs: https://umami.is/docs/tracker-functions

declare global {
  interface Window {
    umami?: {
      track: (eventName?: string | object, eventData?: Record<string, unknown>) => void;
      identify: (userId?: string | Record<string, unknown>, userData?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Track a custom event with Umami
 * @example umami.track('signup-button', { name: 'newsletter', id: 123 })
 */
export function trackEvent(eventName: string, eventData?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(eventName, eventData);
  }
}

/**
 * Identify a user session with Umami
 * @example umami.identify('user-123', { name: 'Bob', email: 'bob@example.com' })
 */
export function identifyUser(userId: string, userData?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.identify(userId, userData);
  }
}

/**
 * Custom hook for Umami tracking
 */
export function useUmami() {
  return {
    track: trackEvent,
    identify: identifyUser,
  };
}
