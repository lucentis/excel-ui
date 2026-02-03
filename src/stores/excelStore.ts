import { computed, reactive } from 'vue'
import type { Workbook } from 'exceljs'
import type { WorkbookConfig, ChartType, RowData } from '@/types'
import { Sheet } from '@/models'
import { SheetService, SectionService, ExcelParser } from '@/services'

/**
 * Excel Store
 * Simple reactive state orchestrator
 */
export const excelStore = reactive<WorkbookConfig>({
  workbook: null,
  fileName: '',
  sheetNames: [],
  sheets: {},
  currentSheet: {
    name: '',
    worksheet: null,
    rawData: [],
    title: '',
    sections: [],
  },
})

// ============================================================================
// Workbook Operations
// ============================================================================

/**
 * Load a workbook and set the first sheet as current
 */
export function setWorkbook(wb: Workbook, name: string): void {
  excelStore.workbook = wb
  excelStore.fileName = name
  excelStore.sheetNames = wb.worksheets.map(ws => ws.name)

  if (excelStore.sheetNames[0]) {
    setCurrentSheet(excelStore.sheetNames[0])
  }
}

/**
 * Switch to a different sheet
 */
export function setCurrentSheet(sheetName: string): void {
  if (!excelStore.workbook) return

  if (excelStore.sheets[sheetName]) {
    excelStore.currentSheet = excelStore.sheets[sheetName]
    return
  }

  const worksheet = excelStore.workbook.getWorksheet(sheetName)
  if (!worksheet) return

  const sheet = SheetService.buildSheet(sheetName, worksheet)

  excelStore.sheets[sheetName] = sheet.toConfig()
  excelStore.currentSheet = sheet.toConfig()
}

/**
 * Clear the workbook and reset state
 */
export function clearWorkbook(): void {
  excelStore.workbook = null
  excelStore.fileName = ''
  excelStore.sheetNames = []
  excelStore.sheets = {}
  excelStore.currentSheet = {
    name: '',
    worksheet: null,
    rawData: [],
    title: '',
    sections: [],
  }
}

// ============================================================================
// Section Operations
// ============================================================================

/**
 * Update a section using a function
 */
function updateSection(
  sectionIndex: number,
  updater: (section: import('@/models').Section) => import('@/models').Section
): void {
  const sheet = Sheet.fromConfig(excelStore.currentSheet)
  const updatedSheet = SheetService.updateSection(sheet, sectionIndex, updater)

  const updatedConfig = updatedSheet.toConfig()

  excelStore.sheets[updatedSheet.name] = updatedConfig
  excelStore.currentSheet = updatedConfig
}

/**
 * Set card recap for a cell
 */
export function setCardRecap(
  sectionIndex: number,
  rowIndex: number,
  colIndex: number
): void {
  updateSection(sectionIndex, section =>
    SectionService.setCardRecap(section, rowIndex, colIndex)
  )
}

/**
 * Set search text for a section
 */
export function setSearchText(sectionIndex: number, searchText: string): void {
  updateSection(sectionIndex, section =>
    SectionService.setSearchText(section, searchText)
  )
}

/**
 * Clear search text for a section
 */
export function clearSearch(sectionIndex: number): void {
  updateSection(sectionIndex, section =>
    SectionService.clearSearch(section)
  )
}

// ============================================================================
// Chart Operations
// ============================================================================

/**
 * Toggle chart visibility/creation for a column
 */
export function toggleSectionChart(sectionIndex: number, columnIndex: number): void {
  updateSection(sectionIndex, section =>
    SectionService.toggleChart(section, columnIndex)
  )
}

/**
 * Change chart type
 */
export function setChartType(
  sectionIndex: number,
  columnIndex: number,
  type: ChartType
): void {
  updateSection(sectionIndex, section =>
    SectionService.setChartType(section, columnIndex, type)
  )
}

/**
 * Change chart label column
 */
export function setChartLabelColumn(
  sectionIndex: number,
  chartColumnIndex: number,
  labelColumnIndex: number
): void {
  updateSection(sectionIndex, section =>
    SectionService.setChartLabelColumn(section, chartColumnIndex, labelColumnIndex)
  )
}

/**
 * Toggle row exclusion for all visible charts in section
 */
export function toggleRowExclusion(sectionIndex: number, row: RowData): void {
  updateSection(sectionIndex, section =>
    SectionService.toggleRowExclusion(section, row)
  )
}

/**
 * Toggle column sort for a section
 */
export function toggleColumnSort(sectionIndex: number, columnIndex: number): void {
  updateSection(sectionIndex, section =>
    SectionService.toggleSort(section, columnIndex)
  )
}

/**
 * Clear sort for a section
 */
export function clearSort(sectionIndex: number): void {
  updateSection(sectionIndex, section =>
    SectionService.clearSort(section)
  )
}

/**
 * Set apply filters to charts for a section
 */
export function setApplyFiltersToCharts(sectionIndex: number, apply: boolean): void {
  updateSection(sectionIndex, section =>
    SectionService.setApplyFiltersToCharts(section, apply)
  )
}