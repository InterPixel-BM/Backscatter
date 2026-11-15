import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2] ?? 'public/data'
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'))
const paths = []
const walk = (value, where) => {
  if (typeof value === 'string' && /\.(webp|png|json|geojson)$/.test(value)) paths.push([where, value])
  else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) walk(child, where ? `${where}.${key}` : key)
  }
}
walk(manifest, '')
const missing = paths.filter(([, path]) => !existsSync(join(root, path)))
for (const [where, path] of missing) console.log(`missing        ${path}  (${where})`)

const dates = manifest.dates.map((entry) => entry.date)
const pairs = dates.flatMap((a, index) => dates.slice(index + 1).map((b) => `${a}_${b}`))
const count = (record, keys) => `${keys.filter((key) => record?.[key]).length}/${keys.length}`
console.log('')
console.log('area                 hv     hh     ratio  ev.dates  ev.pairs  tx.dates  tx.pairs  series  classes  optical')
for (const area of manifest.areas) {
  console.log(
    [
      area.id.padEnd(20),
      count(area.files.hv, dates).padEnd(6),
      count(area.files.hh, dates).padEnd(6),
      count(area.files.ratio, dates).padEnd(6),
      count(area.evidence?.dates, dates).padEnd(9),
      count(area.evidence?.pairs, pairs).padEnd(9),
      count(area.texts?.dates, dates).padEnd(9),
      count(area.texts?.pairs, pairs).padEnd(9),
      (area.series ? 'yes' : 'no').padEnd(7),
      (area.files.classes ? 'yes' : 'no').padEnd(8),
      area.files.optical ? 'yes' : 'no',
    ].join(' '),
  )
}

const stale = []
for (const area of manifest.areas) {
  for (const path of [...Object.values(area.texts?.dates ?? {}), ...Object.values(area.texts?.pairs ?? {})]) {
    if (!existsSync(join(root, path))) continue
    const text = JSON.parse(readFileSync(join(root, path), 'utf8'))
    const evidencePath = join(root, text.evidence_file ?? '')
    if (!text.evidence_file || !existsSync(evidencePath)) stale.push([path, 'evidence_file not found'])
    else if (createHash('sha256').update(readFileSync(evidencePath)).digest('hex') !== text.evidence_sha256) stale.push([path, 'evidence_sha256 differs from the file'])
    else if (!text.check?.passed) stale.push([path, 'check.passed is not true'])
  }
}
console.log('')
for (const [path, problem] of stale) console.log(`text           ${path}  ${problem}`)
console.log(`overview       hv ${count(manifest.overview.files.hv, dates)}  hh ${count(manifest.overview.files.hh, dates)}  ratio ${count(manifest.overview.files.ratio, dates)}  optical ${manifest.overview.files.optical ? 'yes' : 'no'}`)
console.log(`method.json    ${existsSync(join(root, 'method.json')) ? 'yes' : 'no'}`)
console.log(`fields.geojson ${existsSync(join(root, 'fields.geojson')) ? 'yes' : 'no'}`)
console.log(`paths          ${paths.length} in manifest.json, ${missing.length} missing`)
console.log(`texts          ${stale.length} with a problem`)
process.exitCode = missing.length || stale.length ? 1 : 0
