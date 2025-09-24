import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { HeroSection } from '../components/ui/hero-section'
import { FilterPanel } from '../components/ui/filter-panel'
import { LeaderboardTable } from '../components/ui/leaderboard-table'
import { ExternalLink } from 'lucide-react'

type LeaderboardRow = Record<string, string | number | null>

type Task = {
  name: string
  group: string
  description: string
  long_description: string
}

type TasksList = { tasks: Record<string, Task> }

type TaskGroup = {
  name: string
  description: string
  long_description?: string
  repository?: string
  subtasks?: string[]
}

type TaskGroups = { task_groups: Record<string, TaskGroup> }

async function fetchLeaderboard(): Promise<LeaderboardRow[]> {
  try {
    // Try Hugging Face dataset JSON files (assumes converted to parquet/JSON compatible listing)
    // We'll hit the raw file list via the repo tree API. If that fails, fallback to local file.
    const res = await fetch('https://huggingface.co/datasets/mauroibz/leaderboard-results/resolve/main/leaderboard_table.json', { cache: 'no-store' })
    if (res.ok) {
      return await res.json()
    }
  } catch {}
  // Local fallback during dev
  const local = await fetch('/leaderboard_table.json')
  return await local.json()
}

const DEFAULT_VISIBLE = [
  'model_name',
  'overall_latam_score',
  'spanish_score',
  'portuguese_score',
]

export function Landing() {
  const { t } = useI18n()
  const [data, setData] = useState<LeaderboardRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE)
  const [sortBy, setSortBy] = useState<string>('overall_latam_score')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [taskGroups, setTaskGroups] = useState<TaskGroups | null>(null)
  const [/* tasksList */, setTasksList] = useState<TasksList | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  useEffect(() => {
    fetchLeaderboard().then(setData).catch(() => setError('Failed to load leaderboard data'))
    Promise.all([
      fetch('/tasks_groups.json').then(r => r.json() as Promise<TaskGroups>),
      fetch('/tasks_list.json').then(r => r.json() as Promise<TasksList>),
    ]).then(([g, t]) => {
      setTaskGroups(g)
      setTasksList(t)
    }).catch(() => {/* non-fatal */})
  }, [])

  // Determine ordered columns: aggregates, then per-group tasks in JSON order (only those present in data)
  const { orderedColumns, aggregates, groupColumnMap, groupOrder } = useMemo(() => {
    if (!data || data.length === 0) {
      return { orderedColumns: [] as string[], aggregates: new Set<string>(), groupColumnMap: {} as Record<string, string[]>, groupOrder: [] as string[] }
    }
    const present = new Set(Object.keys(data[0]))
    const aggregatesArr = ['overall_latam_score', 'spanish_score', 'portuguese_score']
    const aggregatesSet = new Set(aggregatesArr)

    const groupPrefixMap: Record<string, string> = { latam_es: 'spanish_', latam_pr: 'portuguese_' }
    const map: Record<string, string[]> = {}
    const order: string[] = Object.keys(taskGroups?.task_groups ?? {})
    for (const key of order) {
      const prefix = groupPrefixMap[key]
      if (!prefix) continue
      const subtasks = taskGroups?.task_groups?.[key]?.subtasks ?? []
      const cols = subtasks.map(st => `${prefix}${st}`).filter(col => present.has(col))
      map[key] = cols
    }

    const ordered = ['model_name', ...aggregatesArr]
    for (const key of order) {
      const cols = map[key]
      if (cols && cols.length) ordered.push(...cols)
    }
    // If any remaining present numeric columns are not covered, append them
    const covered = new Set(ordered)
    for (const k of present) {
      if (!covered.has(k)) ordered.push(k)
    }
    return { orderedColumns: ordered, aggregates: aggregatesSet, groupColumnMap: map, groupOrder: order }
  }, [data, taskGroups])

  const sortedData = useMemo(() => {
    if (!data) return [] as LeaderboardRow[]
    const arr = [...data]
    arr.sort((a, b) => {
      const av = a[sortBy]
      const bv = b[sortBy]
      const an = typeof av === 'number' ? av : Number.NEGATIVE_INFINITY
      const bn = typeof bv === 'number' ? bv : Number.NEGATIVE_INFINITY
      return sortDir === 'asc' ? an - bn : bn - an
    })
    return arr
  }, [data, sortBy, sortDir])

  function toggleColumn(col: string) {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    )
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
      
      <div id="leaderboard" className="pb-8 md:pb-20 container">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="btn-outline w-full flex items-center justify-center gap-2"
          >
            <span>Filters</span>
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              {visibleColumns.length}
            </span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-1/5">
            <FilterPanel
              visibleColumns={visibleColumns}
              groupColumnMap={groupColumnMap}
              groupOrder={groupOrder}
              onToggleColumn={toggleColumn}
            />
          </div>

          {/* Mobile Filter Panel */}
          {showMobileFilters && (
            <div className="lg:hidden mb-4 md:mb-6">
              <FilterPanel
                visibleColumns={visibleColumns}
                groupColumnMap={groupColumnMap}
                groupOrder={groupOrder}
                onToggleColumn={toggleColumn}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 lg:w-4/5">
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
        </div>

      </div>
        <div className="flex items-center justify-center gap-2 pt-8 text-sm text-muted-foreground">
          <span>{t('landing.source_prefix')}</span>
          <a 
            href="https://huggingface.co/datasets/mauroibz/leaderboard-results/" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {t('landing.source_link')}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
    </div>
  )
}


