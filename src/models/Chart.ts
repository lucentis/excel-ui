import type { 
    ChartConfig, 
    ChartType, 
    ChartDataPoint,
    ChartMetadata,
    ColumnIndex,
    RowIndex,
  } from '@/types'
  
  /**
   * Chart Model
   * Encapsulates chart configuration and business logic
   */
  export class Chart {
    private constructor(private readonly config: ChartConfig) {}
  
    // ============================================================================
    // Factory methods
    // ============================================================================
  
    static create(
      columnIndex: ColumnIndex,
      labelColumnIndex: ColumnIndex,
      type: ChartType = 'bar',
    ): Chart {
      return new Chart({
        columnIndex,
        labelColumnIndex,
        type,
        excludedRows: [],
        visible: true,
      })
    }
  
    static fromConfig(config: ChartConfig): Chart {
      return new Chart({ ...config })
    }
  
    // ============================================================================
    // Getters
    // ============================================================================
  
    get columnIndex(): ColumnIndex {
      return this.config.columnIndex
    }
  
    get labelColumnIndex(): ColumnIndex {
      return this.config.labelColumnIndex
    }
  
    get type(): ChartType {
      return this.config.type
    }
  
    get excludedRows(): ReadonlyArray<RowIndex> {
      return this.config.excludedRows
    }
  
    get visible(): boolean {
      return this.config.visible
    }
  
    get color(): string | undefined {
      return this.config.color
    }
  
    get title(): string | undefined {
      return this.config.title
    }
  
    // ============================================================================
    // Business logic (immutable operations)
    // ============================================================================
  
    withType(type: ChartType): Chart {
      return new Chart({ ...this.config, type })
    }
  
    withLabelColumn(labelColumnIndex: ColumnIndex): Chart {
      return new Chart({ ...this.config, labelColumnIndex })
    }
  
    withColor(color: string): Chart {
      return new Chart({ ...this.config, color })
    }
  
    withTitle(title: string): Chart {
      return new Chart({ ...this.config, title })
    }
  
    toggleVisibility(): Chart {
      return new Chart({ ...this.config, visible: !this.config.visible })
    }
  
    show(): Chart {
      return new Chart({ ...this.config, visible: true })
    }
  
    hide(): Chart {
      return new Chart({ ...this.config, visible: false })
    }
  
    toggleRowExclusion(rowIndex: RowIndex): Chart {
      const excludedRows = this.config.excludedRows.includes(rowIndex)
        ? this.config.excludedRows.filter(i => i !== rowIndex)
        : [...this.config.excludedRows, rowIndex]
  
      return new Chart({ ...this.config, excludedRows })
    }
  
    excludeRow(rowIndex: RowIndex): Chart {
      if (this.config.excludedRows.includes(rowIndex)) {
        return this
      }
      return new Chart({
        ...this.config,
        excludedRows: [...this.config.excludedRows, rowIndex],
      })
    }
  
    includeRow(rowIndex: RowIndex): Chart {
      return new Chart({
        ...this.config,
        excludedRows: this.config.excludedRows.filter(i => i !== rowIndex),
      })
    }
  
    clearExcludedRows(): Chart {
      return new Chart({ ...this.config, excludedRows: [] })
    }
  
    // ============================================================================
    // Query methods
    // ============================================================================
  
    isRowExcluded(rowIndex: RowIndex): boolean {
      return this.config.excludedRows.includes(rowIndex)
    }
  
    hasExcludedRows(): boolean {
      return this.config.excludedRows.length > 0
    }
  
    getExcludedRowCount(): number {
      return this.config.excludedRows.length
    }
  
    // ============================================================================
    // Serialization
    // ============================================================================
  
    toConfig(): ChartConfig {
      return { ...this.config }
    }
  
    toJSON(): ChartConfig {
      return this.toConfig()
    }
  }