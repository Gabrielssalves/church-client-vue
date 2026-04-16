/**
 * Shared UI primitive types.
 *
 * Centralising these here means domain types (Musician, etc.) and component
 * props can both reference the same union without cross-importing between
 * features and component files.
 */

/** Available badge colour tokens — must match BaseBadge's CSS modifier classes. */
export type BadgeColor = 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'gray'
