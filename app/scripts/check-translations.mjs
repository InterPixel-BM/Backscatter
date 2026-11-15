import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dataDir = process.argv[2] ?? 'public/data'
const i18n = process.argv[3] ?? 'public/i18n'
const only = process.argv[4]
const manifest = JSON.parse(readFileSync(join(dataDir, 'manifest.json'), 'utf8'))
const numbers = (text) => (text.match(/\d+(?:\.\d+)?/g) ?? []).sort().join(' ')
const minus = (text) => (text.match(/(?<![\w.])-(?=\d)/g) ?? []).length
const body = (text) => [text.summary, ...text.sections.map((section) => `${section.heading} ${section.text}`)].join(' ')

const problems = []
const counts = {}
for (const lang of ['fr', 'ar']) {
  for (const area of manifest.areas) {
    if (only && area.id !== only) continue
    const key = `${lang} ${area.id}`
    counts[key] = { files: 0, translated: 0, ok: 0 }
    for (const path of [...Object.values(area.texts.dates), ...Object.values(area.texts.pairs)]) {
      const target = join(i18n, lang, path)
      if (!existsSync(target)) {
        problems.push([target, 'missing'])
        continue
      }
      counts[key].files++
      const english = readFileSync(join(dataDir, path))
      const source = JSON.parse(english.toString('utf8'))
      const translation = JSON.parse(readFileSync(target, 'utf8'))
      if (!translation.translated) continue
      counts[key].translated++
      const found = []
      if (translation.source_sha256 !== createHash('sha256').update(english).digest('hex')) found.push('English source changed since translation')
      if (translation.sections.length !== source.sections.length) found.push('section count differs')
      if (numbers(body(translation)) !== numbers(body(source))) found.push(`numbers differ: ${numbers(body(source))} | ${numbers(body(translation))}`)
      if (minus(body(translation)) !== minus(body(source))) found.push('minus signs differ')
      if (/[٠-٩۰-۹]/.test(body(translation))) found.push('Arabic-Indic digits')
      if (/[—!]/.test(body(translation))) found.push('em dash or exclamation mark')
      if (translation.summary === source.summary) found.push('summary not translated')
      if (found.length) problems.push([target, found.join('; ')])
      else counts[key].ok++
    }
  }
}
console.log('lang area                files  translated  passed')
for (const [key, count] of Object.entries(counts)) console.log(`${key.padEnd(25)} ${String(count.files).padStart(5)} ${String(count.translated).padStart(10)} ${String(count.ok).padStart(7)}`)
for (const [path, problem] of problems) console.log(`problem  ${path}  ${problem}`)
process.exitCode = problems.length ? 1 : 0
