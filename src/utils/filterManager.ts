import type { Section } from '@/types'

/**
 * Check if a row matches the search text
 */
function matchesSearchText(row: unknown[], searchText: string): boolean {
  if (!searchText.trim()) return true

  const search = searchText.toLowerCase()
  
  return row.some(cell => {
    if (cell === null || cell === undefined) return false
    return String(cell).toLowerCase().includes(search)
  })
}

/**
 * Filter section data based on search text
 */
export function filterSectionData(section: Section): unknown[][] {
  if (!section.searchText) return section.data

  return section.data.filter(row => matchesSearchText(row, section.searchText!))
}