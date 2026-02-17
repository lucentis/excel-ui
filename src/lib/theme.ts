/**
 * Application Theme Configuration
 * Single source of truth for all colors across the app.
 *
 * IMPORTANT: Tailwind requires complete class strings at build time.
 * Never use template literals or string concatenation with color values.
 */

/**
 * General UI elements — typography, icons, shared accents
 */
export const UI = {
  title: 'text-slate-800',
  subtitle: 'text-slate-600',
  body: 'text-slate-600',
  muted: 'text-slate-500',
  divider: 'border-slate-200',
  accentIcon: 'text-indigo-600',
  accentText: 'text-indigo-600',
  accentBg: 'bg-indigo-500',
  accentBgHover: 'hover:bg-indigo-500',
} as const

/**
 * Panel — Custom tab (amber)
 */
export const PANEL_CUSTOM = {
  active: 'bg-amber-50 border-amber-200',
  icon: 'text-amber-600',
  title: 'text-amber-900',
  subtitle: 'text-amber-700',
  button: 'bg-amber-600 hover:bg-amber-700 text-white',
  buttonSelected: 'bg-amber-600 hover:bg-amber-700 text-white',
  label: 'text-amber-700',
  documentPreview: 'bg-amber-50 text-amber-900',
  iconHover: 'hover:bg-amber-50',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
} as const

/**
 * Panel — Edition tab (emerald)
 */
export const PANEL_EDITION = {
  active: 'bg-emerald-50 border-emerald-200',
  icon: 'text-emerald-600',
  title: 'text-emerald-900',
  subtitle: 'text-emerald-700',
  button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  label: 'text-slate-600',
  cellInfo: 'bg-emerald-50 border-emerald-200',
  cellInfoText: 'text-emerald-900',
  cellInfoSubtext: 'text-emerald-700',
} as const

/**
 * Data table — cell selection, exclusion, badges
 */
export const DATA_TABLE = {
  hover: 'hover:bg-indigo-50',
  selected: 'bg-indigo-100',
  selectedBadge: 'bg-indigo-100 text-indigo-700',
  addressBadge: 'bg-slate-100 text-slate-600',
  excluded: 'text-amber-500',
  icon: 'text-slate-400',
  iconBg: 'bg-slate-100',
  sortIcon: 'text-indigo-500',
  headerHover: 'hover:bg-slate-50',
  chartBarIcon: 'text-indigo-500',
} as const

/**
 * Shared color palette for cards and sections (same component, same colors)
 */
export const DATA_COLORS = [
  { id: 'slate',   bg: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-900',   accent: 'bg-slate-600'   },
  { id: 'neutral', bg: 'bg-neutral-50', border: 'border-neutral-200', text: 'text-neutral-900', accent: 'bg-neutral-600' },
  { id: 'red',     bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-900',     accent: 'bg-red-600'     },
  { id: 'orange',  bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-900',  accent: 'bg-orange-600'  },
  { id: 'amber',   bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-900',   accent: 'bg-amber-600'   },
  { id: 'yellow',  bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-900',  accent: 'bg-yellow-600'  },
  { id: 'lime',    bg: 'bg-lime-50',    border: 'border-lime-200',    text: 'text-lime-900',    accent: 'bg-lime-600'    },
  { id: 'green',   bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-900',   accent: 'bg-green-600'   },
  { id: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', accent: 'bg-emerald-600' },
  { id: 'teal',    bg: 'bg-teal-50',    border: 'border-teal-200',    text: 'text-teal-900',    accent: 'bg-teal-600'    },
  { id: 'cyan',    bg: 'bg-cyan-50',    border: 'border-cyan-200',    text: 'text-cyan-900',    accent: 'bg-cyan-600'    },
  { id: 'sky',     bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-900',     accent: 'bg-sky-600'     },
  { id: 'blue',    bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-900',    accent: 'bg-blue-600'    },
  { id: 'indigo',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-900',  accent: 'bg-indigo-600'  },
  { id: 'violet',  bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-900',  accent: 'bg-violet-600'  },
  { id: 'purple',  bg: 'bg-purple-50',  border: 'border-purple-200',  text: 'text-purple-900',  accent: 'bg-purple-600'  },
  { id: 'fuchsia', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-900', accent: 'bg-fuchsia-600' },
  { id: 'pink',    bg: 'bg-pink-50',    border: 'border-pink-200',    text: 'text-pink-900',    accent: 'bg-pink-600'    },
  { id: 'rose',    bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-900',    accent: 'bg-rose-600'    },
] as const

/**
 * Semantic colors — warning, error, success, info
 */
export const SEMANTIC = {
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
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: 'text-emerald-500',
  },
  info: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
    icon: 'text-indigo-500',
  },
} as const

/**
 * Helper — get a DATA_COLORS entry by id
 */
export type DataColorId = typeof DATA_COLORS[number]['id']

export function getDataColor(id: DataColorId) {
  return DATA_COLORS.find(c => c.id === id) ?? DATA_COLORS[13] // fallback indigo
}