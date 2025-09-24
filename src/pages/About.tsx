import { useI18n } from '../i18n/I18nProvider'
import Markdown from 'markdown-to-jsx'
import aboutEnMd from '../content/about.en.md?raw'
import aboutEsMd from '../content/about.es.md?raw'
import aboutPtMd from '../content/about.pt.md?raw'

export function About() {
  const { locale } = useI18n()

  const contentMap = {
    en: aboutEnMd,
    es: aboutEsMd,
    pt: aboutPtMd
  }

  const content = contentMap[locale] || contentMap.en

  return (
    <div className="container prose prose-neutral dark:prose-invert prose-sm md:prose-base max-w-3xl py-6 md:py-10 mx-auto">
      <Markdown>{content}</Markdown>
    </div>
  )
}



