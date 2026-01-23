import type { Chart, ChartType, Section } from '@/types'

export function isNumericColumn(section: Section, columnIndex: number): boolean {
  if (section.data.length === 0) return false

  const values = section.data.map((row) => row[columnIndex])
  const numericCount = values.filter((val) => typeof val === 'number').length

  return values.length == numericCount
}

/**
 * Trouve la première colonne texte pour utiliser comme labels
 * Par défaut retourne 0 (première colonne)
 */
export function findLabelColumn(section: Section): number {
  for (let i = 0; i < section.header.length; i++) {
    const values = section.data.map((row) => row[i])
    const textCount = values.filter(
      (val) => typeof val === 'string' || val === null || val === undefined,
    ).length

    if (textCount == values.length) {
      return i
    }
  }

  return 0 // Par défaut première colonne
}

/**
 * Crée une configuration de graphique pour une colonne
 */
export function setSectionChart(section: Section, columnIndex: number): Chart {
  const labelColumnIndex = findLabelColumn(section)

  return {
    columnIndex,
    labelColumnIndex,
    type: 'bar', // Type par défaut
    excludedRows: [], // Initialiser vide
    visible: true, // ✨ Visible par défaut
  }
}

/**
 * Change le type de graphique
 */
export function changeChartType(chart: Chart, newType: ChartType): Chart {
  return {
    ...chart,
    type: newType,
  }
}

/**
 * Prépare les données pour les graphiques
 * ✨ Filtre maintenant les lignes exclues
 */
export function prepareChartData(section: Section, chart: Chart) {
  const excludedRows = chart.excludedRows || []
  
  const data = section.data
    .map((row, index) => ({
      index,
      name: String(row[chart.labelColumnIndex] || ''),
      value: Number(row[chart.columnIndex]) || 0,
    }))
    .filter(item => !excludedRows.includes(item.index)) // ✨ Filtrer les lignes exclues

  console.log(`📊 Données préparées (${data.length}/${section.data.length} lignes)`)

  return data
}

/**
 * Obtient le label de la colonne de valeurs
 */
export function getChartValueLabel(section: Section, chart: Chart): string {
  return String(section.header[chart.columnIndex] || 'Valeur')
}

/**
 * Obtient le label de la colonne de labels
 */
export function getChartLabelName(section: Section, chart: Chart): string {
  return String(section.header[chart.labelColumnIndex] || 'Label')
}

/**
 * Obtient la liste des colonnes non-numériques (candidats pour labels)
 * Nouvelle fonction
 */
export function getLabelCandidateColumns(section: Section): Array<{ index: number; label: string }> {
  return section.header
    .map((header, index) => ({
      index,
      label: String(header || `Col ${index + 1}`)
    }))
    .filter(col => !isNumericColumn(section, col.index))
}