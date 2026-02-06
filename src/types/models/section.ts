/**
 * Types for sections
 */

import type { DataMatrix, RowData } from '../common/base'
import type { ChartConfig } from './chart'
import type { CardRecapConfig } from './card'

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Sort configuration for a section
 */
export interface SortConfig {
  columnIndex: number
  direction: SortDirection
}

/**
 * Section color theme (same as cards for consistency)
 */
export type SectionColorTheme = 
  | 'slate' | 'neutral' | 'red' | 'orange' | 'amber' | 'yellow'
  | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'

/**
 * Section title size options
 */
export type SectionTitleSize = 'large' | 'xlarge' | '2xlarge'

/**
 * Chart position relative to table
 */
export type ChartPosition = 'left' | 'right' | 'top' | 'bottom'

/**
 * Table style configuration
 */
export interface SectionTableStyle {
  /** Show table borders */
  showBorders: boolean
  
  /** Rounded borders */
  roundedBorders: boolean
  
  /** Alternating row colors */
  alternatingRows: boolean
}

/**
 * Section style configuration
 */
export interface SectionStyleConfig {
  /** Color theme */
  colorTheme: SectionColorTheme
  
  /** Title text size */
  titleSize: SectionTitleSize
  
  /** Table style settings */
  tableStyle: SectionTableStyle
  
  /** Chart position */
  chartPosition: ChartPosition
}

/**
 * Default section style configuration
 */
export const DEFAULT_SECTION_STYLE: SectionStyleConfig = {
  colorTheme: 'blue',
  titleSize: 'xlarge',
  tableStyle: {
    showBorders: true,
    roundedBorders: true,
    alternatingRows: true,
  },
  chartPosition: 'right',
}

/**
 * Section configuration
 */
export interface SectionConfig {
  /** Optional section title */
  title?: string
  
  /** Column headers */
  header: RowData
  
  /** Section data */
  data: DataMatrix
  
  /** Recap card configuration (optional) */
  cardRecap?: CardRecapConfig
  
  /** Chart configurations */
  charts?: ChartConfig[]
  
  /** Search/filter configuration */
  searchText?: string
  
  /** Sort configuration */
  sortConfig?: SortConfig
  
  /** Apply filters to charts (default: true) */
  applyFiltersToCharts?: boolean
  
  /** Style configuration */
  style?: SectionStyleConfig
}

/**
 * Section metadata
 */
export interface SectionMetadata {
  /** Number of columns */
  columnCount: number
  
  /** Number of data rows */
  rowCount: number
  
  /** Number of charts */
  chartCount: number
  
  /** Number of visible charts */
  visibleChartCount: number
  
  /** Has a recap card */
  hasCardRecap: boolean
  
  /** Has active search */
  hasActiveSearch: boolean
  
  /** Has active sort */
  hasActiveSort: boolean
  
  /** Is empty (no data) */
  isEmpty: boolean
}

/**
 * Options for creating a section
 */
export interface CreateSectionOptions {
  title?: string
  header: RowData
  data: DataMatrix
  style?: Partial<SectionStyleConfig>
}

/**
 * Column information
 */
export interface ColumnInfo {
  /** Column index */
  index: number
  
  /** Column label */
  label: string
  
  /** Detected type */
  type: 'text' | 'number' | 'date' | 'boolean' | 'mixed' | 'empty'
  
  /** Is numeric */
  isNumeric: boolean
  
  /** Is empty */
  isEmpty: boolean
  
  /** Unique values (for filters) */
  uniqueValues?: Set<unknown>
}

/**
 * Section analysis
 */
export interface SectionAnalysis {
  metadata: SectionMetadata
  columns: ColumnInfo[]
  numericColumns: ColumnInfo[]
  textColumns: ColumnInfo[]
}

/**
 * Complete section state
 */
export interface SectionState extends SectionConfig {
  metadata: SectionMetadata
  filteredData?: DataMatrix
}