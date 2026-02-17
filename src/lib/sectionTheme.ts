/**
 * Section customization options
 * Color palette is sourced from theme.ts DATA_COLORS to avoid duplication.
 */

import type { SectionColorTheme, SectionTitleSize, ChartPosition } from '../types/models/section'
import { DATA_COLORS } from './theme'

export interface SectionColorThemeDefinition {
  id: SectionColorTheme
  label: string
  bg: string
  border: string
  text: string
  accent: string
}

export const SECTION_COLOR_THEMES: SectionColorThemeDefinition[] = DATA_COLORS.map(c => ({
  ...c,
  id: c.id as SectionColorTheme,
  label: c.id.charAt(0).toUpperCase() + c.id.slice(1),
}))

export const SECTION_TITLE_SIZE_OPTIONS: SectionTitleSize[] = ['large', 'xlarge', '2xlarge']

export const CHART_POSITION_OPTIONS: ChartPosition[] = ['left', 'right', 'top', 'bottom']

export function getSectionColorTheme(id: SectionColorTheme): SectionColorThemeDefinition {
  return SECTION_COLOR_THEMES.find(t => t.id === id) ?? SECTION_COLOR_THEMES[13]! // fallback indigo
}

export function getSectionTitleSizeClass(size: SectionTitleSize): string {
  switch (size) {
    case 'large': return 'text-lg'
    case '2xlarge': return 'text-2xl'
    default: return 'text-xl'
  }
}

export function getChartPositionClass(position: ChartPosition): string {
  switch (position) {
    case 'left': return 'flex-row-reverse items-start'
    case 'right': return 'flex-row items-start'
    case 'top': return 'flex-col-reverse'
    case 'bottom': return 'flex-col'
    default: return 'flex-row-reverse items-start'
  }
}

export function getTableBorderClass(showBorders: boolean, roundedBorders: boolean): string {
  const classes: string[] = []
  if (showBorders) classes.push('border')
  if (roundedBorders) classes.push('rounded-lg')
  return classes.join(' ')
}