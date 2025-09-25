#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const ABOUT_HTML_PATH = join(process.cwd(), 'public', 'about.html')
const NAV_SCRIPT_TAG = '<script src="/nav-injector.js"></script>'

function injectNavigation() {
  if (!existsSync(ABOUT_HTML_PATH)) {
    console.log('❌ about.html not found at:', ABOUT_HTML_PATH)
    process.exit(1)
  }

  const content = readFileSync(ABOUT_HTML_PATH, 'utf-8')

  // Check if script is already injected
  if (content.includes(NAV_SCRIPT_TAG)) {
    console.log('✅ Navigation script already present in about.html')
    return
  }

  // Find the closing body tag and inject before it
  const closingBodyRegex = /(\s*)<\/body>/i
  if (!closingBodyRegex.test(content)) {
    console.log('❌ Could not find closing </body> tag in about.html')
    process.exit(1)
  }

  const updatedContent = content.replace(
    closingBodyRegex,
    `$1<!-- Navigation Injection Script -->
$1${NAV_SCRIPT_TAG}

$1</body>`
  )

  writeFileSync(ABOUT_HTML_PATH, updatedContent, 'utf-8')
  console.log('✅ Navigation script injected into about.html')
}

injectNavigation()