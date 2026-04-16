/// <reference types="vite/client" />

import 'vue-router'

/**
 * Augment Vue Router's RouteMeta interface so that route meta fields are
 * typed throughout the codebase (guards, sidebar, layout logic).
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** Whether the route requires an authenticated session. */
    requiresAuth?: boolean
    /** Human-readable label shown in the sidebar. */
    label?: string
    /** Icon name passed to AppIcon. */
    icon?: string
    /** When true the route is excluded from the sidebar. */
    showInSidebar?: boolean
    /** When true the sidebar is hidden on this route (e.g. login page). */
    hideSidebar?: boolean
  }
}
