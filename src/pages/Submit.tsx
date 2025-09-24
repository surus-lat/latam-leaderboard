import { useI18n } from '../i18n/I18nProvider'

export function Submit() {
  const { t } = useI18n()

  return (
    <div className="container max-w-4xl py-6 md:py-10">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">{t('contribute.ready_to_contribute')}</h1>
        <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
          {t('contribute.community_description')}
        </p>
        <a 
          href="https://discord.com/invite/yGCCUhqtpS" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
          style={{ backgroundColor: '#646cffaa' }}
        >
          {t('contribute.join_discord')}
        </a>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-6">{t('contribute.join_discussion')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border bg-card/60 p-6">
              <h3 className="text-lg font-medium mb-3">{t('contribute.models_to_test')}</h3>
              <p className="text-muted-foreground">{t('contribute.models_description')}</p>
            </div>
            <div className="rounded-lg border bg-card/60 p-6">
              <h3 className="text-lg font-medium mb-3">{t('contribute.benchmarks_progress')}</h3>
              <p className="text-muted-foreground">{t('contribute.benchmarks_description')}</p>
            </div>
            <div className="rounded-lg border bg-card/60 p-6">
              <h3 className="text-lg font-medium mb-3">{t('contribute.development_space')}</h3>
              <p className="text-muted-foreground">{t('contribute.development_description')}</p>
            </div>
            <div className="rounded-lg border bg-card/60 p-6">
              <h3 className="text-lg font-medium mb-3">{t('contribute.community_voice')}</h3>
              <p className="text-muted-foreground">{t('contribute.community_voice_description')}</p>
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground mb-4">
            {t('contribute.where_work_happens')}
          </p>
          <p className="text-muted-foreground">
            {t('contribute.ideas_to_standards')}
          </p>
        </div>

        <div className="rounded-lg border bg-card/60 p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">{t('contribute.coming_soon')}</h2>
          <p className="text-muted-foreground mb-4">
            {t('contribute.opensource_announcement')}
          </p>
          <p className="text-muted-foreground">
            {t('contribute.follow_announcement')}
          </p>
        </div>
      </div>
    </div>
  )
}




