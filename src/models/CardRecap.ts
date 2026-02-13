import type { 
  CardRecapConfig,
  CardStyleConfig,
  RowIndex,
  ColumnIndex,
} from '@/types'
import { DEFAULT_CARD_STYLE } from '@/types/models/card'
import type { Cell } from 'exceljs'
import { CellHelper } from '@/services/CellHelper'

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
    value: Cell,
    label: Cell,
  ): CardRecap {
    return new CardRecap({
      rowIndex,
      colIndex,
      value,
      label,
      style: DEFAULT_CARD_STYLE,
    })
  }

  static fromConfig(config: CardRecapConfig): CardRecap {
    return new CardRecap({ 
      ...config,
      style: config.style || DEFAULT_CARD_STYLE,
    })
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

  get value(): Cell {
    return this.config.value
  }

  get label(): Cell {
    return this.config.label!
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

  get style(): CardStyleConfig {
    return this.config.style || DEFAULT_CARD_STYLE
  }

  // ============================================================================
  // Business logic
  // ============================================================================

  withLabel(label: Cell): CardRecap {
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

  withStyle(style: Partial<CardStyleConfig>): CardRecap {
    return new CardRecap({ 
      ...this.config, 
      style: { ...this.style, ...style }
    })
  }

  withFullStyle(style: CardStyleConfig): CardRecap {
    return new CardRecap({ ...this.config, style })
  }

  // ============================================================================
  // Query methods - REFACTORED with CellHelper
  // ============================================================================

  isNumeric(): boolean {
    return CellHelper.isNumeric(this.config.value)
  }

  isEmpty(): boolean {
    return CellHelper.isEmpty(this.config.value)
  }

  getValueType(): 'number' | 'text' | 'date' | 'boolean' | 'empty' {
    if (this.isEmpty()) return 'empty'
    
    const displayValue = CellHelper.getDisplayValue(this.config.value)
    
    if (typeof displayValue === 'number') return 'number'
    if (typeof displayValue === 'boolean') return 'boolean'
    if (displayValue instanceof Date) return 'date'
    return 'text'
  }

  // ============================================================================
  // Formatting - REFACTORED with CellHelper
  // ============================================================================

  formatValue(): string {
    if (this.isEmpty()) return '-'

    const value = CellHelper.getDisplayValue(this.config.value)
    const valueFormat = this.style.valueFormat.type
    const customUnit = this.style.valueFormat.customUnit

    if (typeof value === 'number') {
      switch (valueFormat) {
        case 'integer':
          return Math.round(value).toLocaleString('fr-FR')
        
        case 'percentage':
          return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}%`
        
        case 'currency':
          return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${customUnit || '€'}`
        
        default: // 'number'
          return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
      }
    }

    if (value instanceof Date) {
      return value.toLocaleDateString('fr-FR')
    }

    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non'
    }

    return String(value)
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