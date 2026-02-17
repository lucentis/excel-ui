/**
 * Card customization options
 * Color palette is sourced from theme.ts DATA_COLORS to avoid duplication.
 */

import type { CardColorTheme, CardSize, CardIconPosition, CardTitleSize, CardValueSize, CardValueFormat } from '../types/models/card'
import { DATA_COLORS, getDataColor } from './theme'

// Re-export the shared palette with a label added for UI display
export interface ColorThemeDefinition {
  id: CardColorTheme
  label: string
  bg: string
  border: string
  text: string
  accent: string
}

export const COLOR_THEMES: ColorThemeDefinition[] = DATA_COLORS.map(c => ({
  ...c,
  id: c.id as CardColorTheme,
  label: c.id.charAt(0).toUpperCase() + c.id.slice(1),
}))

export const CARD_SIZE_OPTIONS: CardSize[] = ['small', 'medium', 'large']

export const CARD_ICON_POSITION_OPTIONS: CardIconPosition[] = ['top', 'left', 'right', 'none']

export const CARD_TITLE_SIZE_OPTIONS: CardTitleSize[] = ['small', 'medium', 'large']

export const CARD_VALUE_SIZE_OPTIONS: CardValueSize[] = ['small', 'medium', 'large', 'xlarge']

export interface ValueFormatOption {
  id: CardValueFormat
  label: string
}

export const CARD_VALUE_FORMAT_OPTIONS: ValueFormatOption[] = [
  { id: 'number', label: 'Number' },
  { id: 'integer', label: 'Integer' },
  { id: 'percentage', label: '%' },
  { id: 'currency', label: '€' },
]

export function getColorTheme(id: CardColorTheme): ColorThemeDefinition {
  return COLOR_THEMES.find(t => t.id === id) ?? COLOR_THEMES[13]! // fallback indigo
}

export function getCardPaddingClass(size: CardSize): string {
  switch (size) {
    case 'small': return 'p-3'
    case 'large': return 'p-6'
    default: return 'p-4'
  }
}

export function getTitleSizeClass(size: CardTitleSize): string {
  switch (size) {
    case 'small': return 'text-xs'
    case 'large': return 'text-base'
    default: return 'text-sm'
  }
}

export function getValueSizeClass(size: CardValueSize): string {
  switch (size) {
    case 'small': return 'text-xl'
    case 'medium': return 'text-2xl'
    case 'large': return 'text-3xl'
    case 'xlarge': return 'text-4xl'
    default: return 'text-3xl'
  }
}