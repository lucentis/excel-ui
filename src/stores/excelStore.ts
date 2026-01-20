import { reactive } from 'vue'
import type { Workbook } from 'exceljs'
import type { ExcelStore, ChartType } from '@/types'
import { extractRawData } from '@/utils/excelParser'
import { detectSections } from '@/utils/sectionDetector'
import { createCardRecap } from '@/utils/cardManager'
import { setSectionChart } from '@/utils/chartManager'
// import { createChart, changeChartType } from '@/utils/chartManager'

/**
 * Store réactif pour l'état de l'application Excel
 */
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

/**
 * Charge un workbook Excel dans le store
 */
export function setWorkbook(wb: Workbook, name: string) {
  excelStore.workbook = wb
  excelStore.fileName = name
  excelStore.sheetNames = wb.worksheets.map((ws) => ws.name)

  // Charger la première feuille par défaut
  if (wb.worksheets.length > 0) {
    const firstSheetName = wb.worksheets[0]?.name
    if (firstSheetName) {
      setCurrentSheet(firstSheetName)
    }
  }
}

/**
 * Change la feuille active
 */
export function setCurrentSheet(sheetName: string) {
  if (!excelStore.workbook) return

  const worksheet = excelStore.workbook.getWorksheet(sheetName)
  if (!worksheet) return

  // 1. Parser les données brutes
  const rawData = extractRawData(worksheet)

  // 2. Extraire le titre (ligne 1)
  const title = (rawData[0]?.[0] as string) || ''

  // 3. Détecter les sections
  const sections = detectSections(rawData)

  // 4. Mettre à jour le store
  excelStore.currentSheet = {
    workSheet: worksheet,
    name: sheetName,
    rawData,
    title,
    sections,
  }

  console.log('📊 Feuille chargée:', {
    name: sheetName,
    title,
    sections: sections.length,
  })
}

/**
 * Définit la cellule recap pour une section
 */
export function setCardRecap(sectionIndex: number, rowIndex: number, colIndex: number) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section) return

  section.cardRecap = createCardRecap(section, rowIndex, colIndex)

  console.log(`📌 Card recap définie pour section ${sectionIndex}:`, section.cardRecap)
}

/**
 * Réinitialise le store
 */
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

/**
 * Récupère les infos de la feuille courante
 */
export function getCurrentSheetInfo() {
  return {
    name: excelStore.currentSheet.name,
    sectionsCount: excelStore.currentSheet.sections.length,
    rowsCount: excelStore.currentSheet.rawData.length,
  }
}

/**
 * Active un graphique pour une section
 */
export function toggleSectionChart(sectionIndex: number, columnIndex: number) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section) return

  // Si graphique existe déjà sur cette colonne, le supprimer
  if (section.chart && section.chart.columnIndex === columnIndex) {
    section.chart = undefined
    console.log(`📊 Graphique supprimé pour section ${sectionIndex}`)
  } else {
    // Créer un nouveau graphique
    section.chart = setSectionChart(section, columnIndex)
    console.log(`📊 Graphique créé pour section ${sectionIndex}:`, section.chart)
  }
}

/**
 * Change le type de graphique d'une section
 */
export function setChartType(sectionIndex: number, type: ChartType) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section?.chart) return

  section.chart = changeChartType(section.chart, type)
  console.log(`📊 Type de graphique changé pour section ${sectionIndex}:`, type)
}
