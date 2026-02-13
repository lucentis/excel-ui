/**
 * Constants for section customization options
 */

import type { SectionColorTheme, SectionTitleSize, ChartPosition } from '../types/models/section'

/**
 * Section color theme definitions (reuse card themes for consistency)
 */
export interface SectionColorThemeDefinition {
  id: SectionColorTheme
  label: string
  bg: string
  border: string
  text: string
  accent: string
}

export const SECTION_COLOR_THEMES: SectionColorThemeDefinition[] = [
  { id: 'slate', label: 'Slate', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900', accent: 'bg-slate-600' },
  { id: 'neutral', label: 'Neutral', bg: 'bg-neutral-50', border: 'border-neutral-200', text: 'text-neutral-900', accent: 'bg-neutral-600' },
  { id: 'red', label: 'Red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', accent: 'bg-red-600' },
  { id: 'orange', label: 'Orange', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', accent: 'bg-orange-600' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', accent: 'bg-amber-600' },
  { id: 'yellow', label: 'Yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', accent: 'bg-yellow-600' },
  { id: 'lime', label: 'Lime', bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-900', accent: 'bg-lime-600' },
  { id: 'green', label: 'Green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', accent: 'bg-green-600' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', accent: 'bg-emerald-600' },
  { id: 'teal', label: 'Teal', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', accent: 'bg-teal-600' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900', accent: 'bg-cyan-600' },
  { id: 'sky', label: 'Sky', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900', accent: 'bg-sky-600' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', accent: 'bg-blue-600' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900', accent: 'bg-indigo-600' },
  { id: 'violet', label: 'Violet', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', accent: 'bg-violet-600' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', accent: 'bg-purple-600' },
  { id: 'fuchsia', label: 'Fuchsia', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-900', accent: 'bg-fuchsia-600' },
  { id: 'pink', label: 'Pink', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-900', accent: 'bg-pink-600' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', accent: 'bg-rose-600' },
]

/**
 * Title size options
 */
export const SECTION_TITLE_SIZE_OPTIONS: SectionTitleSize[] = ['large', 'xlarge', '2xlarge']

/**
 * Chart position options
 */
export const CHART_POSITION_OPTIONS: ChartPosition[] = ['left', 'right', 'top', 'bottom']

/**
 * Get section color theme definition by ID
 */
export function getSectionColorTheme(id: SectionColorTheme): SectionColorThemeDefinition {
  return SECTION_COLOR_THEMES.find(t => t.id === id) || SECTION_COLOR_THEMES[12]! // Default to blue
}

/**
 * Get title size class
 */
export function getSectionTitleSizeClass(size: SectionTitleSize): string {
  switch (size) {
    case 'large': return 'text-lg'
    case '2xlarge': return 'text-2xl'
    default: return 'text-xl'
  }
}

/**
 * Get chart position flex class
 */
export function getChartPositionClass(position: ChartPosition): string {
  switch (position) {
    case 'left': return 'flex-row-reverse items-start'
    case 'right': return 'flex-row items-start'
    case 'top': return 'flex-col-reverse'
    case 'bottom': return 'flex-col'
    default: return 'flex-row-reverse items-start'
  }
}

/**
 * Get table border class
 */
export function getTableBorderClass(showBorders: boolean, roundedBorders: boolean): string {
  const classes: string[] = []
  
  if (showBorders) {
    classes.push('border')
  }
  
  if (roundedBorders) {
    classes.push('rounded-lg')
  }
  
  return classes.join(' ')
}