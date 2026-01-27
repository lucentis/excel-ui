import type { 
    CardRecapConfig,
    CellValue,
    RowIndex,
    ColumnIndex,
  } from '@/types'
  
  /**
   * CardRecap Model
   * Encapsulates recap card configuration
   */
  export class CardRecap {
    private constructor(private readonly config: CardRecapConfig) {}
  
    // ============================================================================
    // Factory methods
    // ============================================================================
  
    static create(
      rowIndex: RowIndex,
      colIndex: ColumnIndex,
      value: CellValue,
      label?: string,
    ): CardRecap {
      return new CardRecap({
        rowIndex,
        colIndex,
        value,
        label,
      })
    }
  
    static fromConfig(config: CardRecapConfig): CardRecap {
      return new CardRecap({ ...config })
    }
  
    // ============================================================================
    // Getters
    // ============================================================================
  
    get rowIndex(): RowIndex {
      return this.config.rowIndex
    }
  
    get colIndex(): ColumnIndex {
      return this.config.colIndex
    }
  
    get value(): CellValue {
      return this.config.value
    }
  
    get label(): string | undefined {
      return this.config.label
    }
  
    get unit(): string | undefined {
      return this.config.unit
    }
  
    get color(): string | undefined {
      return this.config.color
    }
  
    get icon(): string | undefined {
      return this.config.icon
    }
  
    // ============================================================================
    // Business logic
    // ============================================================================
  
    withLabel(label: string): CardRecap {
      return new CardRecap({ ...this.config, label })
    }
  
    withUnit(unit: string): CardRecap {
      return new CardRecap({ ...this.config, unit })
    }
  
    withColor(color: string): CardRecap {
      return new CardRecap({ ...this.config, color })
    }
  
    withIcon(icon: string): CardRecap {
      return new CardRecap({ ...this.config, icon })
    }
  
    // ============================================================================
    // Query methods
    // ============================================================================
  
    isNumeric(): boolean {
      return typeof this.config.value === 'number'
    }
  
    isEmpty(): boolean {
      return this.config.value === null || this.config.value === undefined || this.config.value === ''
    }
  
    getValueType(): 'number' | 'text' | 'date' | 'boolean' | 'empty' {
      if (this.isEmpty()) return 'empty'
      if (typeof this.config.value === 'number') return 'number'
      if (typeof this.config.value === 'boolean') return 'boolean'
      if (this.config.value instanceof Date) return 'date'
      return 'text'
    }
  
    // ============================================================================
    // Formatting
    // ============================================================================
  
    formatValue(): string {
      if (this.isEmpty()) return '-'
  
      if (typeof this.config.value === 'number') {
        return new Intl.NumberFormat('fr-FR', {
          maximumFractionDigits: 2,
        }).format(this.config.value)
      }
  
      if (this.config.value instanceof Date) {
        return this.config.value.toLocaleDateString('fr-FR')
      }
  
      if (typeof this.config.value === 'boolean') {
        return this.config.value ? 'Oui' : 'Non'
      }
  
      return String(this.config.value)
    }
  
    // ============================================================================
    // Serialization
    // ============================================================================
  
    toConfig(): CardRecapConfig {
      return { ...this.config }
    }
  
    toJSON(): CardRecapConfig {
      return this.toConfig()
    }
  }