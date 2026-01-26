import type { Section, CardRecap } from '@/types'
import { createCardRecap } from '@/utils/cardManager'

export function buildCardRecap(
  section: Section,
  rowIndex: number,
  colIndex: number,
): CardRecap {
  return createCardRecap(section, rowIndex, colIndex)
}
