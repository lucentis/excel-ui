import { reactive } from 'vue'
import type { Workbook } from 'exceljs'
import type { ExcelStore, ChartType } from '@/types'
import { extractRawData } from '@/utils/excelParser'
import { detectSections } from '@/utils/sectionDetector'
import { createCardRecap } from '@/utils/cardManager'
import { setSectionChart } from '@/utils/chartManager'
import { filterSectionData } from '@/utils/filterManager'

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
 * Toggle la visibilité d'un graphique pour une colonne
 * ✨ Ne supprime plus le graphique, juste toggle visible
 */
export function toggleSectionChart(sectionIndex: number, columnIndex: number) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section) return

  // Initialiser le tableau de charts si nécessaire
  if (!section.charts) {
    section.charts = []
  }

  // Chercher un graphique existant pour cette colonne
  const existingChart = section.charts.find(c => c.columnIndex === columnIndex)

  if (existingChart) {
    // Toggle la visibilité
    existingChart.visible = !existingChart.visible
    console.log(`📊 Graphique ${existingChart.visible ? 'affiché' : 'masqué'} pour colonne ${columnIndex}`)
  } else {
    // Créer un nouveau graphique
    const newChart = setSectionChart(section, columnIndex)
    section.charts.push(newChart)
    console.log(`📊 Graphique créé pour colonne ${columnIndex}:`, newChart)
  }
}

/**
 * Change le type de graphique d'une section pour une colonne spécifique
 * ✨ Mise à jour pour gérer plusieurs charts
 */
export function setChartType(sectionIndex: number, columnIndex: number, type: ChartType) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section?.charts) return

  const chart = section.charts.find(c => c.columnIndex === columnIndex)
  if (!chart) return

  chart.type = type

  console.log(`📊 Type de graphique changé pour colonne ${columnIndex}:`, type)
}

/**
 * Change la colonne des labels (X) pour un graphique
 * ✨ Nouvelle fonction
 */
export function setChartLabelColumn(sectionIndex: number, chartColumnIndex: number, labelColumnIndex: number) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section?.charts) return

  const chart = section.charts.find(c => c.columnIndex === chartColumnIndex)
  if (!chart) return

  chart.labelColumnIndex = labelColumnIndex

  console.log(`📊 Colonne de labels changée pour colonne ${chartColumnIndex}: colonne ${labelColumnIndex}`)
}

/**
 * Toggle l'exclusion d'une ligne pour tous les graphiques d'une section
 * ✨ Mise à jour pour gérer plusieurs charts
 */
export function toggleRowExclusion(sectionIndex: number, rowIndex: number) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section?.charts || section.charts.length === 0) return

  // Appliquer à tous les graphiques visibles de la section
  section.charts.forEach(chart => {
    if (!chart.visible) return

    const excludedRows = chart.excludedRows || []
    const index = excludedRows.indexOf(rowIndex)

    if (index > -1) {
      // Ligne déjà exclue → la réinclure
      chart.excludedRows = excludedRows.filter(i => i !== rowIndex)
    } else {
      // Ligne incluse → l'exclure
      chart.excludedRows = [...excludedRows, rowIndex]
    }
  })

  console.log(`📊 Ligne ${rowIndex} toggle pour tous les graphiques de la section`)
}

/**
 * Set search text for a section
 */
export function setSearchText(sectionIndex: number, searchText: string) {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section) return

  section.searchText = searchText

  console.log(`Search text set for section ${sectionIndex}: "${searchText}"`)
}