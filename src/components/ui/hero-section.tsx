import { ArrowDown } from 'lucide-react'
import velascoPainting from '../../assets/velasco-painting.webp'
import { useI18n } from '../../i18n/I18nProvider'

export function HeroSection() {
  const { t } = useI18n()
  const scrollToLeaderboard = () => {
    const leaderboardSection = document.getElementById('leaderboard')
    if (leaderboardSection) {
      const yOffset = -64 // Account for navbar height (h-16 = 64px)
      const y = leaderboardSection.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center -mt-16">
      {/* Artistic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{ backgroundImage: `url(${velascoPainting})` }}
      />

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/30 via-background/20 to-background/30"></div>

      <div className="relative z-10 w-full pt-16">
        {/* Main Title in Floating Blur Container */}
        <div className="backdrop-blur-md bg-background/10 shadow-2xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-background drop-shadow-lg leading-tight">
              LatamBoard
            </h1>
            <p className="mt-2 text-base sm:text-lg text-background/90 font-medium drop-shadow">
              {t('landing.hero_subtitle')}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 text-center px-4">
          <button
            onClick={scrollToLeaderboard}
            className="btn-primary rounded-full px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
          >
            <span>{t('landing.cta_button')}</span>
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Painting Attribution */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-2">
          <p className="text-xs md:text-sm text-white/90 font-medium">
            José María Velasco
          </p>
          <p className="text-[10px] md:text-xs text-white/70">
            Valle de México desde el cerro de Santa Isabel
          </p>
        </div>
      </div>
    </section>
  )
}