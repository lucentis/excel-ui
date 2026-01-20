import type { Section, CardRecap } from '@/types'

/**
 * Crée une configuration de card recap pour une cellule donnée
 */
export function createCardRecap(section: Section, rowIndex: number, colIndex: number): CardRecap {
  // Si pas de données, on prend la valeur du header lui-même (section à 1 ligne)
  const value =
    section.data.length > 0 ? section.data[rowIndex]?.[colIndex] : section.header[colIndex]

  const label = section.data.length > 0 ? section.header[colIndex] : section.header[0]

  return {
    rowIndex,
    colIndex,
    value,
    label,
  }
}

/**
 * Formate une valeur pour l'affichage dans une card
 */
export function formatCardValue(value: unknown): string {
  if (value === null || value === undefined) return '-'

  if (typeof value === 'number') {
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 2,
    }).format(value)
  }

  return String(value)
}

/**
 * Vérifie si une valeur est numérique
 */
export function isNumericValue(value: unknown): boolean {
  return typeof value === 'number'
}
