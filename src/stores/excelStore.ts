import { reactive } from 'vue'
import type { Workbook, Worksheet } from 'exceljs'

interface ExcelStore {
  // Le workbook complet ExcelJS - contient tout le fichier Excel
  workbook: Workbook | null

  // Nom du fichier uploadé (ex: "budget.xlsx")
  fileName: string

  // Liste des noms des feuilles (ex: ["Budget", "Dépenses", "Récap"])
  sheetNames: string[]

  // La feuille actuellement sélectionnée par l'utilisateur
  currentSheet: Worksheet | null

  // Nom de la feuille active
  currentSheetName: string

  // Données brutes de la feuille active sous forme de tableau 2D
  // Exemple: [['Nom', 'Age'], ['Alice', 25], ['Bob', 30]]
  rawData: any[][]
}

export const excelStore = reactive<ExcelStore>({
  workbook: null,
  fileName: '',
  sheetNames: [],
  currentSheet: null,
  currentSheetName: '',
  rawData: [],
})

/**
 * Initialise le store avec un workbook chargé
 */
export function setWorkbook(wb: Workbook, name: string) {
  excelStore.workbook = wb
  excelStore.fileName = name

  // ExcelJS : récupérer les noms de toutes les feuilles
  excelStore.sheetNames = wb.worksheets.map((ws) => ws.name)

  // Par défaut, sélectionner la première feuille
  if (wb.worksheets.length > 0) {
    setCurrentSheet(wb.worksheets[0].name)
  }
}

/**
 * Change la feuille active et extrait ses données
 */
export function setCurrentSheet(sheetName: string) {
  if (!excelStore.workbook) return

  const worksheet = excelStore.workbook.getWorksheet(sheetName)
  if (!worksheet) return

  excelStore.currentSheet = worksheet
  excelStore.currentSheetName = sheetName

  // Extraire les données brutes dans un tableau 2D
  excelStore.rawData = extractRawData(worksheet)
}

/**
 * Extrait les données d'une feuille en tableau 2D
 * Gère les cellules vides, formules, et types de données
 */
function extractRawData(worksheet: Worksheet): any[][] {
  const data: any[][] = []

  // ExcelJS : eachRow itère sur chaque ligne
  worksheet.eachRow((row, rowNumber) => {
    const rowData: any[] = []

    // Pour chaque cellule de la ligne
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      // Récupérer la valeur de la cellule
      // Si c'est une formule, on prend le résultat calculé
      let value = cell.value

      // Gérer les types spéciaux ExcelJS
      if (value && typeof value === 'object') {
        // Formule : prendre le résultat
        if ('result' in value) {
          value = value.result
        }
        // Texte riche : prendre le texte simple
        else if ('richText' in value) {
          value = value.richText.map((t: any) => t.text).join('')
        }
        // Hyperlien : prendre le texte
        else if ('text' in value) {
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
 * Récupère les données d'une plage de cellules spécifique
 * Exemple: getCellRange('A1', 'C10')
 */
export function getCellRange(startCell: string, endCell: string): any[][] {
  if (!excelStore.currentSheet) return []

  const range =
    excelStore.currentSheet.getCell(startCell).address +
    ':' +
    excelStore.currentSheet.getCell(endCell).address

  const data: any[][] = []
  // Note: ExcelJS n'a pas de méthode directe pour ça,
  // on devrait parser les addresses et itérer
  // C'est un exemple de fonction à compléter si besoin

  return data
}

/**
 * Réinitialise le store
 */
export function clearWorkbook() {
  excelStore.workbook = null
  excelStore.fileName = ''
  excelStore.sheetNames = []
  excelStore.currentSheet = null
  excelStore.currentSheetName = ''
  excelStore.rawData = []
}

/**
 * Récupère des infos sur la feuille active
 */
export function getCurrentSheetInfo() {
  if (!excelStore.currentSheet) return null

  return {
    name: excelStore.currentSheetName,
    rowCount: excelStore.currentSheet.rowCount,
    columnCount: excelStore.currentSheet.columnCount,
    actualRowCount: excelStore.currentSheet.actualRowCount,
    actualColumnCount: excelStore.currentSheet.actualColumnCount,
  }
}
