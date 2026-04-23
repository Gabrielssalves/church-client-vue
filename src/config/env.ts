/**
 * Typed environment configuration module.
 *
 * All VITE_ env variables must be accessed through this module exclusively —
 * never read `import.meta.env` directly in application code. This gives a
 * single place to validate, document, and default every variable.
 *
 * requireEnv() throws at startup so misconfiguration is caught immediately
 * rather than at the point of first use.
 */

function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (!value) {
    // In test environments Vitest may not load .env — surface a clear message
    // instead of a cryptic "undefined is not a string" error downstream.
    throw new Error(
      `[config/env] Missing required environment variable: ${key}. ` +
        'Make sure it is defined in your .env file (or .env.test for Vitest).'
    )
  }
  return value as string
}

function optionalEnv(key: string, fallback = ''): string {
  return (import.meta.env[key] as string | undefined) ?? fallback
}

export const env = {
  /**
   * Base URL for the authentication API.
   * Example: http://localhost:3000
   */
  authBaseUrl: requireEnv('VITE_AUTH_BASE_URL'),

  /**
   * Base URL for the main application API.
   * Example: http://localhost:3000
   */
  apiBaseUrl: requireEnv('VITE_API_BASE_URL'),

  /**
   * Google OAuth 2.0 client ID for the Google Identity Services button.
   */
  googleClientId: requireEnv('VITE_GOOGLE_CLIENT_ID'),

  /** Current Vite mode: 'development' | 'production' | 'test' */
  mode: optionalEnv('MODE', 'development'),

  isDev: import.meta.env.DEV as boolean,
  isProd: import.meta.env.PROD as boolean,
} as const
