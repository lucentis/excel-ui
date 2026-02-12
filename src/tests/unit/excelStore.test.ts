import { describe, it, expect, beforeEach } from 'vitest'
import { Workbook } from 'exceljs'
import {
  excelStore,
  setWorkbook,
  setCurrentSheet,
  clearWorkbook,
  setSearchText,
  toggleSectionChart,
  setChartType,
  toggleColumnSort,
} from '@/stores/excelStore'

describe('excelStore - Sheet switching with state persistence', () => {
  beforeEach(() => {
    clearWorkbook()
  })

  describe('setWorkbook', () => {
    it('should store workbook and sheet names without parsing all sheets', () => {
      const wb = new Workbook()
      
      wb.addWorksheet('Sheet1')
      wb.addWorksheet('Sheet2')
      wb.addWorksheet('Sheet3')

      setWorkbook(wb, 'test.xlsx')

      expect(excelStore.fileName).toBe('test.xlsx')
      expect(excelStore.sheetNames).toEqual(['Sheet1', 'Sheet2', 'Sheet3'])
      
      // Only first sheet should be parsed (lazy loading)
      expect(Object.keys(excelStore.sheets)).toHaveLength(3)
    })

    it('should set first sheet as current', () => {
      const wb = new Workbook()
      const ws = wb.addWorksheet('Test')
      ws.addRow(['Title'])
      ws.addRow([])
      ws.addRow(['Name', 'Value'])
      ws.addRow(['Alice', 100])

      setWorkbook(wb, 'test.xlsx')

      expect(excelStore.currentSheet.name).toBe('Test')
      expect(excelStore.currentSheet.title).toBe('Title')
      expect(excelStore.currentSheet.sections).toHaveLength(1)
    })
  })

  describe('State persistence across sheet switches', () => {
    it('should preserve search text when switching sheets', () => {
      const wb = new Workbook()
      
      const ws1 = wb.addWorksheet('Sheet1')
      ws1.addRow(['Title1'])
      ws1.addRow([])
      ws1.addRow(['Name', 'Value'])
      ws1.addRow(['Alice', 100])
      ws1.addRow(['Bob', 200])
      
      const ws2 = wb.addWorksheet('Sheet2')
      ws2.addRow(['Title2'])
      ws2.addRow([])
      ws2.addRow(['Product', 'Price'])
      ws2.addRow(['Product A', 50])

      setWorkbook(wb, 'test.xlsx')
      
      // Modify Sheet1: add search
      setSearchText(0, 'alice')
      expect(excelStore.currentSheet.sections[0]!.searchText).toBe('alice')
      
      // Switch to Sheet2
      setCurrentSheet('Sheet2')
      expect(excelStore.currentSheet.name).toBe('Sheet2')
      expect(excelStore.currentSheet.sections[0]!.searchText).toBeUndefined()
      
      // Switch back to Sheet1
      setCurrentSheet('Sheet1')
      
      // Search text should be preserved
      expect(excelStore.currentSheet.sections[0]!.searchText).toBe('alice')
    })

    it('should preserve chart configuration when switching sheets', () => {
      const wb = new Workbook()
      
      const ws1 = wb.addWorksheet('Sheet1')
      ws1.addRow(['Title1'])
      ws1.addRow([])
      ws1.addRow(['Name', 'Sales'])
      ws1.addRow(['Alice', 100])
      ws1.addRow(['Bob', 200])
      
      const ws2 = wb.addWorksheet('Sheet2')
      ws2.addRow(['Title2'])

      setWorkbook(wb, 'test.xlsx')
      
      // Add chart on Sheet1
      toggleSectionChart(0, 1) // Column 1 (Sales)
      expect(excelStore.currentSheet.sections[0]!.charts).toHaveLength(1)
      
      // Change chart type
      setChartType(0, 1, 'pie')
      expect(excelStore.currentSheet.sections[0]!.charts![0]!.type).toBe('pie')
      
      // Switch to Sheet2
      setCurrentSheet('Sheet2')
      expect(excelStore.currentSheet.sections[0]?.charts).toBeUndefined()
      
      // Switch back to Sheet1
      setCurrentSheet('Sheet1')
      
      // Chart should be preserved
      expect(excelStore.currentSheet.sections[0]!.charts).toHaveLength(1)
      expect(excelStore.currentSheet.sections[0]!.charts![0]!.type).toBe('pie')
    })

    it('should preserve sort configuration when switching sheets', () => {
      const wb = new Workbook()
      
      const ws1 = wb.addWorksheet('Sheet1')
      ws1.addRow(['Title1'])
      ws1.addRow([])
      ws1.addRow(['Name', 'Age'])
      ws1.addRow(['Alice', 30])
      ws1.addRow(['Bob', 25])
      
      const ws2 = wb.addWorksheet('Sheet2')
      ws2.addRow(['Title2'])

      setWorkbook(wb, 'test.xlsx')
      
      // Add sort on Sheet1
      toggleColumnSort(0, 1) // Sort by Age (ascending)
      expect(excelStore.currentSheet.sections[0]!.sortConfig).toBeDefined()
      expect(excelStore.currentSheet.sections[0]!.sortConfig!.direction).toBe('asc')
      
      // Switch to Sheet2
      setCurrentSheet('Sheet2')
      
      // Switch back to Sheet1
      setCurrentSheet('Sheet1')
      
      // Sort should be preserved
      expect(excelStore.currentSheet.sections[0]!.sortConfig!.direction).toBe('asc')
    })
  })

  describe('clearWorkbook', () => {
    it('should clear all cached sheets', () => {
      const wb = new Workbook()
      
      const ws1 = wb.addWorksheet('Sheet1')
      ws1.addRow(['Doc1'])
      
      const ws2 = wb.addWorksheet('Sheet2')
      ws2.addRow(['Doc2'])

      setWorkbook(wb, 'test.xlsx')
      
      // Access both sheets to cache them
      setCurrentSheet('Sheet2')
      setCurrentSheet('Sheet1')
      
      expect(Object.keys(excelStore.sheets)).toHaveLength(2)

      clearWorkbook()
      
      expect(excelStore.workbook).toBeNull()
      expect(Object.keys(excelStore.sheets)).toHaveLength(0)
      expect(excelStore.sheetNames).toHaveLength(0)
      expect(excelStore.currentSheet.name).toBe('')
    })
  })
})