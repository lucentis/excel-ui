import type { Worksheet } from 'exceljs'
import { extractRawData } from '@/utils/excelParser'
import { detectSections } from '@/utils/sectionDetector'

export function buildSheetState(name: string, worksheet: Worksheet) {
  const rawData = extractRawData(worksheet)
  const title = String(rawData[0]?.[0] || '')
  const sections = detectSections(rawData)

  return {
    name,
    workSheet: worksheet,
    rawData,
    title,
    sections,
  }
}
