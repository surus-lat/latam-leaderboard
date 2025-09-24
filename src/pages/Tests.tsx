import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'

type Task = {
  name: string
  group: string
  description: string
  long_description: string
  fewshot?: number
  URL?: string
}

type TasksList = {
  tasks: Record<string, Task>
}

type TaskGroup = {
  name: string
  description: string
  long_description?: string
  repository?: string
  subtasks?: string[]
}

type TaskGroups = {
  task_groups: Record<string, TaskGroup>
}

function renderMarkdownLinks(text: string) {
  const html = text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1<\/a>')
    .replace(/\n/g, '<br/>')
  return { __html: html }
}

function useTasksData() {
  const [groups, setGroups] = useState<TaskGroups | null>(null)
  const [tasks, setTasks] = useState<TasksList | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/tasks_groups.json').then(r => r.json() as Promise<TaskGroups>),
      fetch('/tasks_list.json').then(r => r.json() as Promise<TasksList>),
    ]).then(([g, t]) => {
      setGroups(g)
      setTasks(t)
    }).catch(() => setError('Failed to load tasks metadata'))
  }, [])

  return { groups, tasks, error }
}

function groupStyles(groupKey: string) {
  // Use the same language aggregate color family for all language groups
  if (groupKey === 'latam_pr') return 'group-card-lang'
  if (groupKey === 'latam_es') return 'group-card-lang'
  return 'bg-muted/30'
}

export function Tests() {
  const { t, locale } = useI18n()
  const { groups, tasks, error } = useTasksData()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [groupExpanded, setGroupExpanded] = useState<Record<string, boolean>>({})

  const groupedTasks = useMemo(() => {
    const map: Record<string, Array<{ id: string; task: Task }>> = {}
    const entries = Object.entries(tasks?.tasks ?? {})
    for (const [id, task] of entries) {
      const key = task.group
      if (!map[key]) map[key] = []
      map[key].push({ id, task })
    }
    return map
  }, [tasks])

  function toggle(id: string) {
    setExpanded((s) => ({ ...s, [id]: !s[id] }))
  }

  function toggleGroup(id: string) {
    setGroupExpanded((s) => ({ ...s, [id]: !s[id] }))
  }

  if (error) {
    return <div className="container py-10 text-destructive">{t('tests.failed_meta')}</div>
  }

  if (!groups) {
    return <div className="container py-10 text-muted-foreground">{t('tests.loading')}</div>
  }

  const entries = Object.entries(groups.task_groups)

  function lx<T extends Record<string, any>>(obj: T, key: string): string {
    const suffixes = locale === 'pt' ? ['_pt', '_pr'] : locale === 'es' ? ['_es'] : ['_en']
    for (const s of suffixes) {
      const k = `${key}${s}`
      if (typeof obj[k] === 'string' && obj[k]) return obj[k]
    }
    // fallback to english explicit
    if (typeof obj[`${key}_en`] === 'string' && obj[`${key}_en`]) return obj[`${key}_en`]
    // finally base
    if (typeof obj[key] === 'string' && obj[key]) return obj[key]
    return ''
  }

  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{t('tests.title')}</h1>

      <div className="space-y-6 md:space-y-10">
        {entries.map(([groupKey, group]) => (
          <section key={groupKey}>
            <div
              className={`rounded border p-4 md:p-5 ${groupStyles(groupKey)} cursor-pointer`}
              role="button"
              tabIndex={0}
              aria-expanded={!!groupExpanded[groupKey]}
              onClick={() => toggleGroup(groupKey)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGroup(groupKey) } }}
            >
              <div className="flex items-start justify-between gap-3 md:gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    {lx(group, 'name')}
                    <span className={`transition-transform ${groupExpanded[groupKey] ? 'rotate-90' : ''}`}>›</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">{lx(group, 'description')}</p>
                </div>
                {group.repository && (
                  <a
                    className="text-sm underline hover:text-secondary"
                    href={group.repository.startsWith('http') ? group.repository : undefined}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t('tests.repo')}
                  </a>
                )}
              </div>
              {groupExpanded[groupKey] && (lx(group, 'long_description')) && (
                <div className="mt-3 text-sm text-foreground/90" dangerouslySetInnerHTML={renderMarkdownLinks(lx(group, 'long_description'))} />
              )}
            </div>

            <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(groupedTasks[groupKey] ?? []).map(({ id, task }) => (
                <div key={id} className="rounded border bg-card/60">
                  <button aria-expanded={!!expanded[id]} onClick={() => toggle(id)} className="w-full text-left p-4">
                    <div className="font-medium">{lx(task, 'name')}</div>
                    <div className="text-sm text-muted-foreground">{lx(task, 'description')}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{t('tests.key')}: {id}{typeof task.fewshot === 'number' ? ` • ${t('tests.shots')}: ${task.fewshot}` : ''}</div>
                  </button>
                  {expanded[id] && (
                    <div className="px-4 pb-4 text-sm text-foreground/90">
                      {lx(task, 'long_description') && (
                        <div className="mb-2" dangerouslySetInnerHTML={renderMarkdownLinks(lx(task, 'long_description'))} />
                      )}
                      {task.URL && (
                        <a className="text-xs underline text-secondary" href={task.URL} target="_blank" rel="noreferrer">{t('tests.dataset')}</a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}



