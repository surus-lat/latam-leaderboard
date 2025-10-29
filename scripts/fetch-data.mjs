// Simple downloader to populate public/ with leaderboard data from a configurable URL
// Config via env vars:
// - LEADERBOARD_DATA_URL: base URL to fetch from (default: HF dataset resolve path)
// - LEADERBOARD_DATA_FILES: comma-separated list of files (default: leaderboard_table.json,tasks_groups.json,tasks_list.json)
// - HF_TOKEN: optional Hugging Face token for private repos or higher rate limits
// - LEADERBOARD_FETCH_ALL: if 'true', fetch all files from the repo using the HF tree API
// - LEADERBOARD_REPO: repo id like "mauroibz/leaderboard-results" (auto-parsed from URL if not set)
// - LEADERBOARD_FETCH_PATTERN: only download files ending with this pattern when fetching all (default: .json). Set to '*' for all files.

import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

const BASE_URL = process.env.LEADERBOARD_DATA_URL || 'https://huggingface.co/datasets/mauroibz/leaderboard-results/resolve/main'
const DEFAULT_FILES = 'leaderboard_table.json,tasks_groups.json,tasks_list.json'
const FILES = (process.env.LEADERBOARD_DATA_FILES || DEFAULT_FILES)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const FETCH_ALL = String(process.env.LEADERBOARD_FETCH_ALL || '').toLowerCase() === 'true'
const FETCH_PATTERN = process.env.LEADERBOARD_FETCH_PATTERN || '.json'
const FETCH_CONTRIBUTORS = String(process.env.LEADERBOARD_FETCH_CONTRIBUTORS ?? 'true').toLowerCase() === 'true'

const headers = {}
if (process.env.HF_TOKEN) {
  headers.Authorization = `Bearer ${process.env.HF_TOKEN}`
}

async function downloadFile(fileName) {
  const url = `${BASE_URL.replace(/\/$/, '')}/${fileName}`
  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }
  const arrayBuffer = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const outDir = join(process.cwd(), 'public')
  if (!existsSync(outDir)) {
    await mkdir(outDir, { recursive: true })
  }
  const outPath = join(outDir, fileName)
  const outParent = dirname(outPath)
  if (!existsSync(outParent)) {
    await mkdir(outParent, { recursive: true })
  }
  await writeFile(outPath, buffer)
  console.log(`Saved ${fileName} -> public/${fileName}`)
}

function parseRepoIdFromBaseUrl(urlStr) {
  try {
    const idx = urlStr.indexOf('/datasets/')
    if (idx === -1) return null
    const rest = urlStr.slice(idx + '/datasets/'.length)
    const parts = rest.split('/')
    const owner = parts[0]
    const name = parts[1]?.includes('resolve') ? parts[1].split('resolve')[0] : parts[1]
    if (owner && name) return `${owner}/${name}`
    return null
  } catch {
    return null
  }
}

async function listRepoFiles(repoId) {
  const apiUrl = `https://huggingface.co/api/datasets/${repoId}/tree/main?recursive=1`
  const res = await fetch(apiUrl, { headers })
  if (!res.ok) throw new Error(`Failed to list repo tree: ${res.status} ${res.statusText}`)
  const items = await res.json()
  // items: [{path, type}]
  return items.filter((it) => it.type === 'file').map((it) => it.path)
}

async function main() {
  try {
    const repoId = process.env.LEADERBOARD_REPO || parseRepoIdFromBaseUrl(BASE_URL) || 'mauroibz/leaderboard-results'

    if (FETCH_ALL) {
      const all = await listRepoFiles(repoId)
      const matchAll = FETCH_PATTERN === '*'
      const toDownload = all.filter((p) => matchAll || p.endsWith(FETCH_PATTERN))
      for (const file of toDownload) {
        await downloadFile(file)
      }
    } else {
      for (const file of FILES) {
        await downloadFile(file)
      }
    }

    if (!FETCH_ALL && FETCH_CONTRIBUTORS) {
      const all = await listRepoFiles(repoId)
      const contributorsFiles = all.filter((p) => p.startsWith('contributors/'))
      for (const file of contributorsFiles) {
        await downloadFile(file)
      }
    }
    console.log('Fetch complete.')
  } catch (err) {
    console.error('[fetch-data] Error:', err?.message || err)
    process.exitCode = 1
  }
}

main()


