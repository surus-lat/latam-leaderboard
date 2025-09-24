import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { About } from './pages/About'
import { Tests } from './pages/Tests'
import { Submit } from './pages/Submit'
import { Navigation } from './components/ui/navigation'
import { useI18n } from './i18n/I18nProvider'

function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} surus.lat —</span>
            <span className="font-medium text-foreground">{t('common.app_name')}</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a 
              href="https://surus.lat" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t('common.our_website')}
            </a>
            <a 
              href="https://discord.com/invite/yGCCUhqtpS" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t('common.join_discord')}
            </a>
            <a 
              href="mailto:contacto@surus.dev" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t('common.contact_email')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/contribute" element={<Submit />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
