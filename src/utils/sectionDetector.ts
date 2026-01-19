import type { Section } from '@/types'
import { isEmptyRow, countFilledCells } from './excelParser'

/**
 * Détecte les sections dans les données brutes selon les conventions :
 * - Ligne 1 = titre du document
 * - Sections séparées par lignes vides
 * - Section = titre optionnel (1 cellule) + header + data
 */
export function detectSections(rawData: unknown[][]): Section[] {
  const sections: Section[] = []
  let currentSectionRows: unknown[][] = []

  // Ignorer la première ligne (titre du document)
  rawData.slice(1).forEach((row) => {
    if (!isEmptyRow(row)) {
      // Ligne non vide : ajouter à la section courante
      currentSectionRows.push(row)
    } else {
      // Ligne vide : finaliser la section courante
      if (currentSectionRows.length > 0) {
        sections.push(parseSection(currentSectionRows))
        currentSectionRows = []
      }
    }
  })

  // Finaliser la dernière section si non vide
  if (currentSectionRows.length > 0) {
    sections.push(parseSection(currentSectionRows))
  }

  return sections
}

/**
 * Parse un bloc de lignes en Section
 * Détecte si première ligne est un titre (1 cellule) ou directement un header
 */
function parseSection(rows: unknown[][]): Section {
  const section: Section = {
    header: [],
    data: [],
  }

  if (rows.length === 0) return section

  const firstRowCellCount = countFilledCells(rows[0])

  if (firstRowCellCount === 1 && rows.length > 1) {
    // Première ligne = titre de section (1 cellule remplie)
    section.title = String(rows[0]?.[0])
    section.header = rows[1] as string[]
    section.data = rows.slice(2)
  } else {
    // Pas de titre, première ligne = header
    section.header = rows[0] as string[]
    section.data = rows.slice(1)
  }

  return section
}
