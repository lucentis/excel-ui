import type { Worksheet } from 'exceljs'

/**
 * Extrait les données brutes d'une worksheet ExcelJS
 * Convertit les types spéciaux (formules, richText, etc.) en valeurs simples
 */
export function extractRawData(worksheet: Worksheet): unknown[][] {
  const data: unknown[][] = []

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    const rowData: unknown[] = []

    row.eachCell({ includeEmpty: true }, (cell) => {
      let value = cell.value

      // Gérer les types spéciaux ExcelJS
      if (value && typeof value === 'object') {
        if ('result' in value) {
          // Formule : prendre le résultat
          value = value.result
        } else if ('richText' in value) {
          // Rich text : extraire le texte simple
          value = value.richText.map((t: any) => t.text).join('')
        } else if ('text' in value) {
          // Hyperlien : prendre le texte
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
 * Vérifie si une ligne est complètement vide
 */
export function isEmptyRow(row: unknown[]): boolean {
  return row.every((cell) => cell === null || cell === undefined || cell === '')
}

/**
 * Compte le nombre de cellules remplies dans une ligne
 */
export function countFilledCells(row: unknown[] | undefined): number {
  if (!row) return 0
  return row.filter((cell) => cell !== null && cell !== undefined && cell !== '').length
}
