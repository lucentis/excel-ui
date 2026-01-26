import { reactive } from 'vue'
import type { Workbook } from 'exceljs'
import type { ExcelStore, ChartType } from '@/types'
import { buildSheetState } from '@/utils/sheetManager'
import {
  toggleChartForSection,
  updateChartType,
  updateChartLabelColumn,
  toggleRowForCharts,
} from '@/utils/chartManager'
import { buildCardRecap } from '@/utils/sectionManager'

export const excelStore = reactive<ExcelStore>({
  workbook: null,
  fileName: '',
  sheetNames: [],
  currentSheet: {
    name: '',
    workSheet: null,
    rawData: [],
    title: '',
    sections: [],
  },
})

/* =======================
   Workbook / Sheet
======================= */

export function setWorkbook(wb: Workbook, name: string) {
  excelStore.workbook = wb
  excelStore.fileName = name
  excelStore.sheetNames = wb.worksheets.map(ws => ws.name)

  if (excelStore.sheetNames[0]) {
    setCurrentSheet(excelStore.sheetNames[0])
  }
}

export function setCurrentSheet(sheetName: string) {
  if (!excelStore.workbook) return

  const worksheet = excelStore.workbook.getWorksheet(sheetName)
  if (!worksheet) return

  excelStore.currentSheet = buildSheetState(sheetName, worksheet)
}

export function clearWorkbook() {
  excelStore.workbook = null
  excelStore.fileName = ''
  excelStore.sheetNames = []
  excelStore.currentSheet = {
    name: '',
    workSheet: null,
    rawData: [],
    title: '',
    sections: [],
  }
}

/* =======================
   Sections
======================= */

export function setCardRecap(
  sectionIndex: number,
  rowIndex: number,
  colIndex: number,
) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section) return

  section.cardRecap = buildCardRecap(section, rowIndex, colIndex)
}

export function setSearchText(sectionIndex: number, searchText: string) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section) return

  section.searchText = searchText
}

/* =======================
   Charts
======================= */

export function toggleSectionChart(sectionIndex: number, columnIndex: number) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section) return

  toggleChartForSection(section, columnIndex)
}

export function setChartType(
  sectionIndex: number,
  columnIndex: number,
  type: ChartType,
) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section) return

  updateChartType(section, columnIndex, type)
}

export function setChartLabelColumn(
  sectionIndex: number,
  chartColumnIndex: number,
  labelColumnIndex: number,
) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section) return

  updateChartLabelColumn(section, chartColumnIndex, labelColumnIndex)
}

export function toggleRowExclusion(sectionIndex: number, rowIndex: number) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section) return

  toggleRowForCharts(section, rowIndex)
}
