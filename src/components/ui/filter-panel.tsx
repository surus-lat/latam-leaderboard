import { Filter, X } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'

interface FilterPanelProps {
  visibleColumns: string[]
  groupColumnMap: Record<string, string[]>
  groupOrder: string[]
  onToggleColumn: (column: string) => void
}

export function FilterPanel({
  visibleColumns,
  groupColumnMap,
  groupOrder,
  onToggleColumn
}: FilterPanelProps) {
  const { t } = useI18n()
  const getBadgeStyle = (isActive: boolean) => {
    if (!isActive) {
      return 'badge-outline hover:bg-accent hover:text-accent-foreground'
    }
    return 'badge-default'
  }

  const cleanColumnName = (column: string) => {
    return column.replace(/^spanish_|^portuguese_/, '')
  }

  return (
    <div className="card border rounded-lg p-4 md:p-6 space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 rounded bg-primary/5">
            <Filter className="h-3 w-3 md:h-4 md:w-4 text-primary" />
          </div>
          <h3 className="text-sm md:text-base font-bold">{t('filters.title')}</h3>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded border">
            {visibleColumns.length} {t('filters.active')}
          </span>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Overall Score */}
        <div className="space-y-2 md:space-y-3">
          <h4 className="text-xs md:text-sm font-medium text-muted-foreground">{t('filters.overall_performance')}</h4>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            <button
              onClick={() => onToggleColumn('overall_latam_score')}
              className={`badge text-xs transition-all ${getBadgeStyle(visibleColumns.includes('overall_latam_score'))}`}
            >
              {visibleColumns.includes('overall_latam_score') && (
                <X className="h-3 w-3 mr-1" />
              )}
{t('filters.overall_latam_score')}
            </button>
          </div>
        </div>

        {/* Language Groups */}
        {groupOrder.map((groupKey) => {
          const prefixMap: Record<string, string> = { 
            latam_es: 'spanish_', 
            latam_pr: 'portuguese_' 
          }
          const prefix = prefixMap[groupKey]
          if (!prefix) return null

          const groupName = groupKey === 'latam_es' ? 'Spanish' : 'Portuguese'
          const aggCol = `${prefix.slice(0, -1)}_score`
          const subtasks = groupColumnMap[groupKey] ?? []

          return (
            <div key={groupKey} className="space-y-2 md:space-y-3">
              <h4 className="text-xs md:text-sm font-medium text-muted-foreground">{groupName} {t('filters.benchmarks')}</h4>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {/* Aggregate score */}
                <button
                  onClick={() => onToggleColumn(aggCol)}
                  className={`badge text-xs transition-all ${getBadgeStyle(visibleColumns.includes(aggCol))}`}
                >
                  {visibleColumns.includes(aggCol) && (
                    <X className="h-3 w-3 mr-1" />
                  )}
                  {cleanColumnName(aggCol)}
                </button>

                {/* Subtasks */}
                {subtasks.map((column) => (
                  <button
                    key={column}
                    onClick={() => onToggleColumn(column)}
                    className={`badge text-[10px] md:text-xs transition-all ${getBadgeStyle(visibleColumns.includes(column))}`}
                  >
                    {visibleColumns.includes(column) && (
                      <X className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
                    )}
                    {cleanColumnName(column)}
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {/* Quick Actions */}
        <div className="flex flex-col gap-1.5 md:gap-2 pt-3 md:pt-4 border-t">
          <button
            onClick={() => {
              const allColumns = ['model_name', 'overall_latam_score', 'spanish_score', 'portuguese_score']
              allColumns.forEach(col => {
                if (!visibleColumns.includes(col)) {
                  onToggleColumn(col)
                }
              })
            }}
            className="btn-outline text-[10px] md:text-xs px-2 md:px-3 py-1"
          >
{t('filters.show_main_scores')}
          </button>
          <button
            onClick={() => {
              visibleColumns.forEach(col => {
                if (col !== 'model_name') {
                  onToggleColumn(col)
                }
              })
            }}
            className="btn-outline text-[10px] md:text-xs px-2 md:px-3 py-1"
          >
{t('filters.clear_all')}
          </button>
        </div>
      </div>
    </div>
  )
}