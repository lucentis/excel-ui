import type { 
    SectionConfig,
    SectionMetadata,
    ColumnInfo,
    DataMatrix,
    RowData,
    ColumnIndex,
    RowIndex,
  } from '@/types'
  import { Chart } from './Chart'
  import { CardRecap } from './CardRecap'
  
  /**
   * Section Model
   * Encapsulates section data and operations
   */
  export class Section {
    private constructor(private readonly config: SectionConfig) {}
  
    // ============================================================================
    // Factory methods
    // ============================================================================
  
    static create(title: string | undefined, header: RowData, data: DataMatrix): Section {
      return new Section({
        title,
        header,
        data,
        charts: [],
      })
    }
  
    static fromConfig(config: SectionConfig): Section {
      return new Section({ ...config })
    }
  
    // ============================================================================
    // Getters
    // ============================================================================
  
    get title(): string | undefined {
      return this.config.title
    }
  
    get header(): ReadonlyArray<unknown> {
      return this.config.header
    }
  
    get data(): ReadonlyArray<ReadonlyArray<unknown>> {
      return this.config.data
    }
  
    get cardRecap(): CardRecap | undefined {
      return this.config.cardRecap ? CardRecap.fromConfig(this.config.cardRecap) : undefined
    }
  
    get charts(): ReadonlyArray<Chart> {
      return (this.config.charts || []).map(c => Chart.fromConfig(c))
    }
  
    get searchText(): string | undefined {
      return this.config.searchText
    }
  
    // ============================================================================
    // Business logic
    // ============================================================================
  
    withTitle(title: string): Section {
      return new Section({ ...this.config, title })
    }
  
    withSearchText(searchText: string): Section {
      return new Section({ ...this.config, searchText })
    }
  
    clearSearch(): Section {
      return new Section({ ...this.config, searchText: undefined })
    }
  
    setCardRecap(cardRecap: CardRecap): Section {
      return new Section({ ...this.config, cardRecap: cardRecap.toConfig() })
    }
  
    clearCardRecap(): Section {
      return new Section({ ...this.config, cardRecap: undefined })
    }
  
    addChart(chart: Chart): Section {
      const charts = [...(this.config.charts || []), chart.toConfig()]
      return new Section({ ...this.config, charts })
    }
  
    updateChart(columnIndex: ColumnIndex, updater: (chart: Chart) => Chart): Section {
      const charts = (this.config.charts || []).map(c => 
        c.columnIndex === columnIndex ? updater(Chart.fromConfig(c)).toConfig() : c
      )
      return new Section({ ...this.config, charts })
    }
  
    removeChart(columnIndex: ColumnIndex): Section {
      const charts = (this.config.charts || []).filter(c => c.columnIndex !== columnIndex)
      return new Section({ ...this.config, charts })
    }
  
    toggleChart(columnIndex: ColumnIndex): Section {
      const existingChart = this.config.charts?.find(c => c.columnIndex === columnIndex)
      
      if (existingChart) {
        return this.updateChart(columnIndex, chart => chart.toggleVisibility())
      }
  
      const labelColumnIndex = this.findLabelColumn()
      const newChart = Chart.create(columnIndex, labelColumnIndex)
      return this.addChart(newChart)
    }
  
    // ============================================================================
    // Query methods
    // ============================================================================
  
    getMetadata(): SectionMetadata {
      return {
        columnCount: this.config.header.length,
        rowCount: this.config.data.length,
        chartCount: this.config.charts?.length || 0,
        visibleChartCount: this.config.charts?.filter(c => c.visible).length || 0,
        hasCardRecap: !!this.config.cardRecap,
        hasActiveSearch: !!this.config.searchText,
        isEmpty: this.config.data.length === 0,
      }
    }
  
    getColumnInfo(columnIndex: ColumnIndex): ColumnInfo {
      const label = String(this.config.header[columnIndex] || `Col ${columnIndex + 1}`)
      const values = this.config.data.map(row => row[columnIndex])
      const isNumeric = values.every(v => typeof v === 'number' || v == null)
      const isEmpty = values.every(v => v == null || v === '')
  
      let type: ColumnInfo['type'] = 'mixed'
      if (isEmpty) {
        type = 'empty'
      } else if (isNumeric) {
        type = 'number'
      } else if (values.every(v => typeof v === 'string' || v == null)) {
        type = 'text'
      } else if (values.every(v => v instanceof Date || v == null)) {
        type = 'date'
      } else if (values.every(v => typeof v === 'boolean' || v == null)) {
        type = 'boolean'
      }
  
      return {
        index: columnIndex,
        label,
        type,
        isNumeric,
        isEmpty,
      }
    }
  
    getAllColumnInfo(): ColumnInfo[] {
      return this.config.header.map((_, i) => this.getColumnInfo(i))
    }
  
    getNumericColumns(): ColumnInfo[] {
      return this.getAllColumnInfo().filter(c => c.isNumeric && !c.isEmpty)
    }
  
    getTextColumns(): ColumnInfo[] {
      return this.getAllColumnInfo().filter(c => c.type === 'text' && !c.isEmpty)
    }
  
    findLabelColumn(): ColumnIndex {
      const textColumns = this.getTextColumns()
      return textColumns.length > 0 ? textColumns[0]!.index : 0
    }
  
    hasChart(columnIndex: ColumnIndex): boolean {
      return this.config.charts?.some(c => c.columnIndex === columnIndex) || false
    }
  
    getChart(columnIndex: ColumnIndex): Chart | undefined {
      const chartConfig = this.config.charts?.find(c => c.columnIndex === columnIndex)
      return chartConfig ? Chart.fromConfig(chartConfig) : undefined
    }
  
    getVisibleCharts(): Chart[] {
      return this.charts.filter(c => c.visible)
    }
  
    // ============================================================================
    // Filtering
    // ============================================================================
  
    getFilteredData(): DataMatrix {
      if (!this.config.searchText) {
        return this.config.data
      }
  
      const search = this.config.searchText.toLowerCase()
      return this.config.data.filter(row => 
        row.some(cell => {
          if (cell == null) return false
          return String(cell).toLowerCase().includes(search)
        })
      )
    }
  
    // ============================================================================
    // Serialization
    // ============================================================================
  
    toConfig(): SectionConfig {
      return { ...this.config }
    }
  
    toJSON(): SectionConfig {
      return this.toConfig()
    }
  }