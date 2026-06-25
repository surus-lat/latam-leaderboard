import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { HeroSection } from '../components/ui/hero-section'
import { LeaderboardTable } from '../components/ui/leaderboard-table'
import { ContributorsRail } from '../components/ui/contributors-wall'
import { ExternalLink } from 'lucide-react'

type LeaderboardRow = Record<string, string | number | null>

const HF_BASE = 'https://huggingface.co/datasets/LatamBoard/leaderboard-results/resolve/main'

async function fetchLeaderboard(): Promise<LeaderboardRow[]> {
  const res = await fetch(`${HF_BASE}/leaderboard_table.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to load leaderboard data from HuggingFace (${res.status})`)
  return res.json()
}

const TASK_OPTIONS = [
  { key: 'spanish', column: 'spanish_score' },
  { key: 'portuguese', column: 'portuguese_score' },
  { key: 'translation', column: 'translation_score' },
  { key: 'structured_extraction', column: 'structured_extraction_score' },
  { key: 'image_extraction', column: 'image_extraction_score' },
  { key: 'transcription', column: 'transcription_score' },
] as const

const DEFAULT_SELECTED_TASKS = ['spanish', 'portuguese']

export function Landing() {
  const { t } = useI18n()
  const [data, setData] = useState<LeaderboardRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>(DEFAULT_SELECTED_TASKS)
  const [sortBy, setSortBy] = useState<string>('overall_score')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchLeaderboard().then(setData).catch(() => setError('Failed to load leaderboard data'))
  }, [])

  const taskOptions = TASK_OPTIONS.map((task) => ({
    ...task,
    label: t(`landing.task_labels.${task.key}`)
  }))

  const selectedTaskColumns = useMemo(() => {
    return TASK_OPTIONS.filter((task) => selectedTasks.includes(task.key)).map((task) => task.column)
  }, [selectedTasks])

  const visibleColumns = useMemo(() => {
    return ['model_name', 'publisher', 'overall_score', ...selectedTaskColumns]
  }, [selectedTaskColumns])

  const orderedColumns = visibleColumns

  const aggregates = useMemo(() => {
    return new Set(['overall_score', ...selectedTaskColumns])
  }, [selectedTaskColumns])

  const dataWithOverall = useMemo(() => {
    if (!data) return [] as LeaderboardRow[]
    return data.map((row) => {
      const values = selectedTaskColumns.map((col) => row[col])
      const numericValues = values.filter((value): value is number => typeof value === 'number')
      // Average over present scores instead of requiring all-tasks-present: a transcription-only
      // specialist (e.g. an ASR model) should still get an overall_score so it ranks visibly when
      // the user adds Transcription to the selected tasks. Returns null only when the row has no
      // scores in any selected task.
      const overall = numericValues.length > 0
        ? numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
        : null
      return { ...row, overall_score: overall }
    })
  }, [data, selectedTaskColumns])

  useEffect(() => {
    if (!visibleColumns.includes(sortBy)) {
      setSortBy('overall_score')
      setSortDir('desc')
    }
  }, [visibleColumns, sortBy])

  const sortedData = useMemo(() => {
    if (!data) return [] as LeaderboardRow[]
    const arr = [...dataWithOverall]
    arr.sort((a, b) => {
      const av = a[sortBy]
      const bv = b[sortBy]
      const an = typeof av === 'number' ? av : Number.NEGATIVE_INFINITY
      const bn = typeof bv === 'number' ? bv : Number.NEGATIVE_INFINITY
      return sortDir === 'asc' ? an - bn : bn - an
    })
    return arr
  }, [data, dataWithOverall, sortBy, sortDir])

  function toggleTask(taskKey: string) {
    setSelectedTasks((prev) => {
      if (prev.includes(taskKey)) {
        return prev.length === 1 ? prev : prev.filter((key) => key !== taskKey)
      }
      return [...prev, taskKey]
    })
  }

  function handleSort(col: string) {
    if (sortBy === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(col)
      setSortDir('desc')
    }
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <div id="leaderboard" className="pb-8 md:pb-20 px-4 md:px-6 lg:px-8">
        <div className="card border rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <p className="text-sm md:text-base font-semibold text-foreground">
            {t('landing.task_selector_prompt')}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {taskOptions.map((task) => {
              const isSelected = selectedTasks.includes(task.key)
              return (
                <button
                  key={task.key}
                  onClick={() => toggleTask(task.key)}
                  className={`badge text-sm px-3 py-1.5 transition-all ${isSelected ? 'badge-default' : 'badge-outline hover:bg-accent hover:text-accent-foreground'}`}
                  aria-pressed={isSelected}
                >
                  {task.label}
                </button>
              )
            })}
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            {t('landing.task_selector_learn_more')}{' '}
            <a
              href="/tests"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t('landing.task_selector_learn_more_link')}
            </a>
          </div>
        </div>

        <LeaderboardTable
          data={sortedData}
          visibleColumns={visibleColumns}
          orderedColumns={orderedColumns}
          aggregates={aggregates}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          loading={data === null && !error}
          error={error}
        />
      </div>
      <div className="flex items-center justify-center gap-2 pt-8 text-sm text-muted-foreground">
        <span>{t('landing.source_prefix')}</span>
        <a 
          href="https://huggingface.co/datasets/LatamBoard/leaderboard-results/"
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {t('landing.source_link')}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <ContributorsRail />
    </div>
  )
}
