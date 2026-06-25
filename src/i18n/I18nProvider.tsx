import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LOCALE, translations } from './index'
import type { Locale, TranslationDict } from './index'

type I18nContextValue = {
  locale: Locale
  t: (path: string) => string
  setLocale: (loc: Locale) => void
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

function getFromDict(dict: TranslationDict, path: string): string | undefined {
  const parts = path.split('.')
  let cur: unknown = dict
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = (cur as Record<string, unknown>)[p]
    } else {
      return undefined
    }
  }
  return typeof cur === 'string' ? cur : undefined
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem('locale') as Locale | null
    if (stored && (['en','es','pt'] as const).includes(stored)) return stored
    // Try navigator
    const nav = (navigator.language || 'en').slice(0, 2)
    if (nav === 'es' || nav === 'pt') return nav
    return DEFAULT_LOCALE
  })

  useEffect(() => {
    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((loc: Locale) => setLocaleState(loc), [])

  const dict = translations[locale]

  const t = useCallback((path: string) => {
    const found = getFromDict(dict, path)
    if (found !== undefined) return found
    // fallback to EN
    const fb = getFromDict(translations.en, path)
    return fb ?? path
  }, [dict])

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="rounded border bg-background px-2 py-1 text-xs"
      aria-label="Language"
    >
      <option value="en">EN</option>
      <option value="es">ES</option>
      <option value="pt">PT</option>
    </select>
  )
}


