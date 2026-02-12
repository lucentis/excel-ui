import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import type { Cell } from 'exceljs'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCellValue(cell: Cell | null, format: string = 'fr-FR') {
  if (cell?.value === null || cell?.value === undefined) return ''

  if (cell?.formula) return cell?.formula

  if (cell?.value instanceof Date) return cell?.value.toLocaleDateString(format)

  return cell.value
}