/**
 * Theme Configuration
 * Centralized color palette for the entire application
 * 
 * IMPORTANT: Tailwind needs complete class names at build time.
 * Do NOT use template literals like `bg-${color}`.
 */

/**
 * Component-specific color classes (complete strings for Tailwind)
 */
export const THEME_COLORS = {
    // CustomTab
    customTab: {
      documentPreview: 'bg-indigo-50 text-indigo-900',
      sectionTitle: 'text-slate-700',
      sectionSubtext: 'text-slate-500',
      icon: 'text-slate-400',
      iconHover: 'hover:bg-slate-100',
      badge: 'text-slate-600 border-slate-200',
      warning: 'bg-amber-50 border-amber-200 text-amber-800',
    },
  
    // EditionTab
    editionTab: {
      activeState: 'bg-emerald-50 border-emerald-200',
      activeIcon: 'text-emerald-600',
      activeTitle: 'text-emerald-900',
      activeSubtext: 'text-emerald-700',
      cellInfo: 'bg-emerald-50 border-emerald-200',
      cellInfoText: 'text-emerald-900',
      cellInfoSubtext: 'text-emerald-700',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      label: 'text-slate-600',
      helper: 'text-slate-500',
    },
  
    // DataTable
    dataTable: {
      hover: 'hover:bg-indigo-50',
      selected: 'bg-indigo-100',
      selectedBadge: 'bg-indigo-100 text-indigo-700',
      excluded: 'text-amber-500',
      icon: 'text-slate-400',
      iconBg: 'bg-slate-100',
      addressBadge: 'bg-slate-100 text-slate-600',
    },
  
    // Dialogs (Card & Section)
    dialog: {
      buttonSelected: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      buttonOutline: 'border-slate-200 hover:bg-slate-50',
      label: 'text-slate-600',
      chartIcon: 'text-indigo-600',
      helper: 'text-slate-500',
    },
  
    // General UI elements
    ui: {
      title: 'text-slate-900',
      subtitle: 'text-slate-700',
      body: 'text-slate-600',
      muted: 'text-slate-500',
      divider: 'border-slate-200',
    },
  } as const
  
  /**
   * Semantic colors for warnings, errors, etc.
   */
  export const SEMANTIC_COLORS = {
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: 'text-amber-500',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-500',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-500',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-500',
    },
  } as const
  
  /**
   * Helper to get space-separated class strings for easy spreading
   */
  export function cn(...classes: (string | undefined | false)[]): string {
    return classes.filter(Boolean).join(' ')
  }
  
  export default THEME_COLORS