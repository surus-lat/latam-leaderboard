import { useEffect, useState } from 'react'

export type ContributorLogo = {
  file: string
  src: string
  title: string
  url?: string
}

type ManifestResponse = {
  logos?: ContributorLogo[]
}

type ContributorsState = {
  logos: ContributorLogo[]
  loading: boolean
  error: string | null
}

const manifestUrl = '/contributors/index.json'

export function useContributorsLogos(): ContributorsState {
  const [logos, setLogos] = useState<ContributorLogo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadManifest() {
      setLoading(true)
      try {
        const response = await fetch(manifestUrl, { cache: 'force-cache' })
        if (!response.ok) {
          throw new Error(`Failed to fetch contributors manifest: ${response.status}`)
        }
        const data = (await response.json()) as ManifestResponse
        if (!cancelled) {
          setLogos(Array.isArray(data?.logos) ? data.logos : [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[contributors] manifest fetch failed', err)
          setError(err instanceof Error ? err.message : 'unknown_error')
          setLogos([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadManifest()

    return () => {
      cancelled = true
    }
  }, [])

  return { logos, loading, error }
}
