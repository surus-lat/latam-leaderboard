import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { LanguageSwitcher, useI18n } from '../../i18n/I18nProvider'

export function Navigation() {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  const navItems = [
    { href: '/', label: t('common.home') },
    { href: '/tests', label: t('common.tasks') },
    { href: '/about', label: t('common.about') },
    { href: '/contribute', label: t('common.contribute') },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="font-mono text-lg font-medium tracking-tight"
          onClick={() => setIsMobileOpen(false)}
        >
          LatamBoard
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm transition-colors ${
                location.pathname === item.href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-4 pl-4 border-l border-border">
            <LanguageSwitcher />
          </div>
        </nav>

        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-4 py-2 text-sm transition-colors ${
                  location.pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}