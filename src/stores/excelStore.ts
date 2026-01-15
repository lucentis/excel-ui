import { reactive, computed } from 'vue'
import type { Workbook, Worksheet } from 'exceljs'

interface Section {
  title?: string // Titre de la section (optionnel)
  startRow: number // Ligne où commence la section (0-based)
  headerRow: number // Ligne des en-têtes
  dataStartRow: number // Première ligne de données
  dataEndRow: number // Dernière ligne de données
}

interface ExcelConfig {
  docTitleRow: number // Ligne du titre du document (défaut: 0)
  sections: Section[] // Sections détectées
  autoDetect: boolean // Détection auto activée
}

interface ExcelStore {
  workbook: Workbook | null
  fileName: string
  sheetNames: string[]
  currentSheet: Worksheet | null
  currentSheetName: string
  rawData: any[][]
  config: ExcelConfig
}

export const excelStore = reactive<ExcelStore>({
  workbook: null,
  fileName: '',
  sheetNames: [],
  currentSheet: null,
  currentSheetName: '',
  rawData: [],
  config: {
    docTitleRow: 0,
    sections: [],
    autoDetect: true,
  },
})

// Computed : titre du document
export const docTitle = computed(() => {
  if (excelStore.rawData.length === 0) return ''
  const titleRow = excelStore.rawData[excelStore.config.docTitleRow]
  return titleRow?.[0] || 'Sans titre'
})

// Computed : en-têtes selon la config
export const headers = computed(() => {
  if (excelStore.rawData.length === 0) return []
  return excelStore.rawData[0] || []
})

// Computed : lignes de données (après l'en-tête)
export const dataRows = computed(() => {
  if (excelStore.rawData.length === 0) return []
  return excelStore.rawData.slice(1)
})

export function setWorkbook(wb: Workbook, name: string) {
  excelStore.workbook = wb
  excelStore.fileName = name
  excelStore.sheetNames = wb.worksheets.map((ws) => ws.name)

  if (wb.worksheets.length > 0) {
    setCurrentSheet(wb.worksheets[0].name)
  }
}

export function setCurrentSheet(sheetName: string) {
  if (!excelStore.workbook) return

  const worksheet = excelStore.workbook.getWorksheet(sheetName)
  if (!worksheet) return

  excelStore.currentSheet = worksheet
  excelStore.currentSheetName = sheetName
  excelStore.rawData = extractRawData(worksheet)

  // Reset et détection auto
  excelStore.config = {
    docTitleRow: 0,
    sections: [],
    autoDetect: true,
  }

  if (excelStore.config.autoDetect) {
    detectSections()
  }
}

function extractRawData(worksheet: Worksheet): any[][] {
  const data: any[][] = []

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    const rowData: any[] = []

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      let value = cell.value

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

/**
 * Vérifie si une ligne est vide
 */
function isEmptyRow(row: any[]): boolean {
  return row.every((cell) => cell === null || cell === undefined || cell === '')
}

/**
 * Compte le nombre de cellules remplies dans une ligne
 */
function countFilledCells(row: any[]): number {
  return row.filter((cell) => cell !== null && cell !== undefined && cell !== '').length
}

/**
 * Détecte automatiquement les sections selon les conventions
 */
export function detectSections() {
  const data = excelStore.rawData
  console.log(data)
  if (data.length < 3) return // Minimum: titre + vide + section

  const sections: Section[] = []
  let i = excelStore.config.docTitleRow + 1 // Commencer après le titre

  // Chercher la première ligne vide après le titre
  while (i < data.length && !isEmptyRow(data[i])) {
    i++
  }
  i++ // Passer la ligne vide

  // Parcourir le reste pour détecter les sections
  while (i < data.length) {
    // Sauter les lignes vides
    if (isEmptyRow(data[i])) {
      i++
      continue
    }

    const sectionStartRow = i
    let title: string | undefined
    let headerRow: number

    // Vérifier si c'est un titre de section (1 seule cellule remplie)
    const filledCells = countFilledCells(data[i])

    if (filledCells === 1) {
      // C'est un titre de section
      title = String(data[i].find((cell) => cell !== null && cell !== undefined && cell !== ''))
      i++

      // La ligne suivante doit être l'en-tête
      if (i >= data.length || isEmptyRow(data[i])) {
        break // Section invalide
      }
      headerRow = i
    } else {
      // Pas de titre, cette ligne est directement l'en-tête
      headerRow = i
    }

    i++ // Passer aux données
    const dataStartRow = i

    // Trouver la fin de la section (ligne vide ou fin du fichier)
    while (i < data.length && !isEmptyRow(data[i])) {
      i++
    }

    const dataEndRow = i - 1

    // Ajouter la section si elle a au moins une ligne de données
    if (dataEndRow >= dataStartRow) {
      sections.push({
        title,
        startRow: sectionStartRow,
        headerRow,
        dataStartRow,
        dataEndRow,
      })
    }
  }

  excelStore.config.sections = sections

  console.log('📊 Sections détectées:', sections)
}

/**
 * Active/désactive la détection automatique
 */
export function setAutoDetect(enabled: boolean) {
  excelStore.config.autoDetect = enabled
  if (enabled) {
    detectSections()
  }
}

/**
 * Change la ligne du titre du document
 */
export function setDocTitleRow(row: number) {
  if (row >= 0 && row < excelStore.rawData.length) {
    excelStore.config.docTitleRow = row
    if (excelStore.config.autoDetect) {
      detectSections()
    }
  }
}

export function clearWorkbook() {
  excelStore.workbook = null
  excelStore.fileName = ''
  excelStore.sheetNames = []
  excelStore.currentSheet = null
  excelStore.currentSheetName = ''
  excelStore.rawData = []
  excelStore.config = {
    docTitleRow: 0,
    sections: [],
    autoDetect: true,
  }
}

export function getCurrentSheetInfo() {
  if (!excelStore.currentSheet) return null

  return {
    name: excelStore.currentSheetName,
    rowCount: excelStore.currentSheet.rowCount,
    columnCount: excelStore.currentSheet.columnCount,
    actualRowCount: excelStore.currentSheet.actualRowCount,
    actualColumnCount: excelStore.currentSheet.actualColumnCount,
  }
}
