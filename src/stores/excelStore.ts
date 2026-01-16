import { reactive, computed } from 'vue'
import type { Workbook, Worksheet } from 'exceljs'
import type { ExcelStore, Section } from '@/types'

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

export const dataRows = computed(() => {
  if (excelStore.currentSheet.rawData.length === 0) return []
  return excelStore.currentSheet.rawData.slice(1)
})

function filledCellCount(row: unknown[] | undefined) {
  return row?.filter((c) => c !== null && c !== undefined && c !== '').length
}

export function setWorkbook(wb: Workbook, name: string) {
  excelStore.workbook = wb
  excelStore.fileName = name
  excelStore.sheetNames = wb.worksheets.map((ws) => ws.name)

  if (wb.worksheets.length > 0) {
    wb.worksheets[0]?.name && setCurrentSheet(wb.worksheets[0].name)
  }
}

export function setCurrentSheet(sheetName: string) {
  if (!excelStore.workbook) return

  const worksheet = excelStore.workbook.getWorksheet(sheetName)
  if (!worksheet) return

  excelStore.currentSheet.workSheet = worksheet
  excelStore.currentSheet.name = sheetName
  excelStore.currentSheet.rawData = extractRawData(worksheet)
  excelStore.currentSheet.title = excelStore.currentSheet.rawData[0]?.[0] as string

  console.log(excelStore.currentSheet?.rawData)

  detectSections()
}

function extractRawData(worksheet: Worksheet): any[][] {
  const data: any[][] = []

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    const rowData: any[] = []

    row.eachCell({ includeEmpty: true }, (cell) => {
      let value = cell.value

      console.log(cell)

      if (value && typeof value === 'object') {
        if ('result' in value) {
          value = value.result
        } else if ('richText' in value) {
          value = value.richText.map((t: any) => t.text).join('')
        } else if ('text' in value) {
          value = value.text
        }
      }

      rowData.push(value)
    })

    data.push(rowData)
  })

  return data
}

function isEmptyRow(row: any[]): boolean {
  return row.every((cell) => cell === null || cell === undefined || cell === '')
}

export function detectSections() {
  const sections: Section[] = []
  let currentSection: unknown[][] = []

  excelStore.currentSheet.rawData.slice(1).forEach(function (row, index) {
    if (!isEmptyRow(row)) {
      currentSection.push(row)
    } else {
      if (currentSection.length > 0) {
        sections.push(parseSection(currentSection))
      }
      currentSection = []
    }
  })

  if (currentSection.length > 0) {
    sections.push(parseSection(currentSection))
  }

  excelStore.currentSheet.sections = sections
  console.log('📊 Sections détectées:', excelStore)
}

function parseSection(section: unknown[][]): Section {
  const builtSection: Section = {
    header: [],
    data: [],
  }

  if (filledCellCount(section[0]) === 1) {
    builtSection.title = String(section[0]?.[0])
    builtSection.header = section[1] as string[]
    builtSection.data = section.slice(2)
  } else {
    builtSection.header = section[0] as string[]
    builtSection.data = section.slice(1)
  }

  return builtSection
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

export function getCurrentSheetInfo() {
  if (!excelStore.currentSheet) return null

  return {
    name: excelStore.currentSheet.name,
    rowCount: excelStore.currentSheet.rowCount,
    columnCount: excelStore.currentSheet.columnCount,
    actualRowCount: excelStore.currentSheet.actualRowCount,
    actualColumnCount: excelStore.currentSheet.actualColumnCount,
  }
}
