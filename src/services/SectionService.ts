import { Section } from '@/models'
import { CardService } from './CardService'
import { ChartService } from './ChartService'
import type { 
  RowIndex,
  ColumnIndex,
  ChartType,
} from '@/types'

/**
 * SectionService
 * Business logic for section operations
 */
export class SectionService {
  /**
   * Create a card recap for a section cell
   */
  static setCardRecap(
    section: Section,
    rowIndex: RowIndex,
    colIndex: ColumnIndex,
  ): Section {
    const cardRecap = CardService.createCardRecap(
      section.toConfig(),
      rowIndex,
      colIndex
    )
    return section.setCardRecap(cardRecap)
  }

  /**
   * Toggle chart visibility/creation for a column
   */
  static toggleChart(section: Section, columnIndex: ColumnIndex): Section {
    return section.toggleChart(columnIndex)
  }

  /**
   * Change chart type
   */
  static setChartType(
    section: Section,
    columnIndex: ColumnIndex,
    type: ChartType,
  ): Section {
    return section.updateChart(columnIndex, chart => 
      ChartService.changeChartType(chart, type)
    )
  }

  /**
   * Change chart label column
   */
  static setChartLabelColumn(
    section: Section,
    chartColumnIndex: ColumnIndex,
    labelColumnIndex: ColumnIndex,
  ): Section {
    return section.updateChart(chartColumnIndex, chart =>
      ChartService.changeChartLabelColumn(chart, labelColumnIndex)
    )
  }

  /**
   * Toggle row exclusion for all visible charts in section
   */
  static toggleRowExclusion(
    section: Section,
    rowIndex: RowIndex,
  ): Section {
    const visibleCharts = section.getVisibleCharts()
    
    let updatedSection = section
    for (const chart of visibleCharts) {
      updatedSection = updatedSection.updateChart(
        chart.columnIndex,
        c => ChartService.toggleRowExclusion(c, rowIndex)
      )
    }

    return updatedSection
  }

  /**
   * Set search text for section
   */
  static setSearchText(section: Section, searchText: string): Section {
    return section.withSearchText(searchText)
  }

  /**
   * Clear search text
   */
  static clearSearch(section: Section): Section {
    return section.clearSearch()
  }

  /**
   * Toggle column sort
   */
  static toggleSort(section: Section, columnIndex: ColumnIndex): Section {
    return section.toggleSort(columnIndex)
  }

  /**
   * Clear sort
   */
  static clearSort(section: Section): Section {
    return section.clearSort()
  }
}