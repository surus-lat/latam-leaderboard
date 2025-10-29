import type { CSSProperties } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { useContributorsLogos } from '../../hooks/use-contributors-logos'

const shimmerBoxes = Array.from({ length: 6 })

export function ContributorsRail() {
  const { t } = useI18n()
  const { logos, error } = useContributorsLogos()
  const hasContent = logos.length > 0
  const displayItems = hasContent ? [...logos, ...logos] : shimmerBoxes
  const marqueeDurationSeconds = Math.max(hasContent ? logos.length * 4 : 24, 24)

  if (error && !hasContent) {
    return null
  }

  return (
    <section className="bg-muted/30 py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground md:text-sm md:tracking-[0.4em]">
            {t('landing.contributors_prefix')}
          </p>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-transparent via-background/60 to-transparent py-6">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-muted/30 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none" aria-hidden="true" />
          <div
            className="contributors-marquee flex items-center gap-12"
            style={{ '--marquee-duration': `${marqueeDurationSeconds}s` } as CSSProperties}
          >
            {displayItems.map((logo, index) => {
              const isDuplicate = hasContent && index >= logos.length
              return (
                <div
                  key={typeof logo === 'object' ? `${logo.file}-${index}` : index}
                  className="flex shrink-0 items-center justify-center"
                  aria-hidden={isDuplicate}
                >
                  {typeof logo === 'object' ? (
                    <img
                      src={logo.src}
                      alt={logo.title}
                      loading="lazy"
                      className="h-10 w-auto object-contain opacity-80 transition duration-300 hover:opacity-100 md:h-12"
                    />
                  ) : (
                    <div className="h-10 w-24 animate-pulse rounded-md bg-muted md:h-12" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContributorsGridSection() {
  const { t } = useI18n()
  const { logos, loading, error } = useContributorsLogos()
  const emptyState = !loading && (error || logos.length === 0)

  if (emptyState) {
    return null
  }

  const metaLabel = loading
    ? t('contribute.contributors_loading')
    : `${logos.length} ${t('contribute.contributors_label')}`

  return (
    <section className="mt-12 md:mt-16">
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm md:p-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold md:text-3xl">
              {t('contribute.contributors_heading')}
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              {t('contribute.contributors_subheading')}
            </p>
          </div>
          <span className="text-sm text-muted-foreground md:text-base">
            {metaLabel}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {(loading ? shimmerBoxes : logos).map((logo, index) => {
            if (typeof logo !== 'object') {
              return (
                <div key={index} className="h-28 w-full animate-pulse rounded-2xl bg-muted/70" aria-hidden="true" />
              )
            }

            const containerClasses =
              'group relative flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-background/60 p-6 text-center transition-all duration-300 hover:border-primary/60 hover:bg-background hover:shadow-lg'

            if (logo.url) {
              return (
                <div
                  key={logo.file}
                  className={`${containerClasses} cursor-pointer hover:-translate-y-1 focus-within:-translate-y-1`}
                >
                  <a
                    href={logo.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex h-full w-full flex-col items-center justify-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={logo.title}
                  >
                    <img
                      src={logo.src}
                      alt={logo.title}
                      loading="lazy"
                      className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.05] group-focus-visible:scale-[1.05]"
                    />
                    <span className="mt-4 text-sm font-medium text-muted-foreground group-hover:text-foreground">
                      {logo.title}
                    </span>
                  </a>
                </div>
              )
            }

            return (
              <div key={logo.file} className={`${containerClasses} cursor-default`}>
                <img
                  src={logo.src}
                  alt={logo.title}
                  loading="lazy"
                  className="h-14 w-auto object-contain transition-transform duration-300"
                />
                <span className="mt-4 text-sm font-medium text-muted-foreground">
                  {logo.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
