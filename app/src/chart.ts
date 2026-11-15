import type { ScriptableLineSegmentContext } from 'chart.js'
import { cssColour, dateLong, dateShort, el } from './format'
import { t } from './i18n'
import type { Area, Manifest, Series } from './types'

interface Mark {
  date: string
  label: string
}

interface Line {
  label: string
  colour: string
  values: (number | null)[]
}

export function seriesLines(area: Area, series: Series, manifest: Manifest): Line[] {
  if (area.chart === 'water') return [{ label: t('Lake area'), colour: cssColour('water'), values: series.water_km2 ?? [] }]
  return manifest.classes
    .filter((terrainClass) => series.hv_db_by_class?.[terrainClass.id])
    .map((terrainClass) => ({ label: t(terrainClass.name), colour: terrainClass.colour, values: series.hv_db_by_class![terrainClass.id] }))
}

export function seriesTable(series: Series, lines: Line[], unit: string): HTMLTableElement {
  return el('table', { class: 'compact' }, [
    el('thead', {}, [el('tr', {}, [el('th', {}, [t('Date')]), ...lines.map((line) => el('th', { class: 'num' }, [`${line.label} (${unit})`]))])]),
    el(
      'tbody',
      {},
      series.dates.map((date, index) =>
        el('tr', {}, [
          el('td', {}, [dateLong(date), series.flags[index].length ? t(', flagged') : '']),
          ...lines.map((line) => el('td', { class: 'num' }, [line.values[index] === null ? t('no value') : String(line.values[index])])),
        ]),
      ),
    ),
  ])
}

export async function drawSeries(canvas: HTMLCanvasElement, series: Series, lines: Line[], unit: string, manifest: Manifest, marks: Mark[]) {
  const { Chart, LineController, LineElement, PointElement, LinearScale, Tooltip, Legend } = await import('chart.js')
  Chart.register(LineController, LineElement, PointElement, LinearScale, Tooltip, Legend)
  const ink = cssColour('ink')
  const inkSoft = cssColour('ink-soft')
  const flagged = cssColour('flagged')
  const rule = cssColour('rule-light')
  const family = getComputedStyle(document.body).fontFamily
  const time = (iso: string) => Date.parse(iso)
  const gap = manifest.no_data_window.map(time)
  const isFlagged = series.flags.map((codes) => codes.length > 0)

  return new Chart(canvas, {
    type: 'line',
    data: {
      datasets: lines.map((line) => ({
        label: line.label,
        data: series.dates.map((date, index) => ({ x: time(date), y: line.values[index] })),
        borderColor: line.colour,
        backgroundColor: line.colour,
        borderWidth: 1.6,
        pointStyle: isFlagged.map((flag) => (flag ? 'rectRot' : 'circle')),
        pointRadius: isFlagged.map((flag) => (flag ? 5 : 3)),
        pointBackgroundColor: isFlagged.map((flag) => (flag ? flagged : line.colour)),
        pointBorderColor: isFlagged.map((flag) => (flag ? ink : line.colour)),
        spanGaps: false,
        clip: 8,
        segment: { borderDash: (context: ScriptableLineSegmentContext) => (context.p0.parsed.x! < gap[0] && context.p1.parsed.x! > gap[1] ? [4, 3] : undefined) },
      })),
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 16, left: 4, right: 10 } },
      scales: {
        x: {
          type: 'linear',
          min: time(series.dates[0]),
          max: time(series.dates[series.dates.length - 1]),
          afterBuildTicks: (axis) => {
            axis.ticks = series.dates.map((date) => ({ value: time(date) }))
          },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            color: inkSoft,
            font: { family, size: 11 },
            callback: (value) => dateShort(new Date(Number(value)).toISOString()).split(' '),
          },
          grid: { color: rule },
        },
        y: {
          title: { display: true, text: unit, color: inkSoft, font: { family, size: 11 } },
          ticks: { color: inkSoft, font: { family, size: 11 } },
          grid: { color: rule },
        },
      },
      plugins: {
        legend: {
          display: lines.length > 1,
          position: 'bottom',
          labels: { boxWidth: 10, boxHeight: 10, color: ink, font: { family, size: 11 } },
        },
        tooltip: {
          callbacks: {
            title: (items) => dateLong(new Date(items[0].parsed.x!).toISOString()),
            label: (item) => `${item.dataset.label}: ${(item.raw as { y: number | null }).y ?? t('no value')} ${unit}`,
            afterBody: (items) => {
              const index = items[0].dataIndex
              return series.flags[index].map((code) => t('Flagged: {text}', { text: manifest.flag_text[code] ?? code }))
            },
          },
        },
      },
    },
    plugins: [
      {
        id: 'marks',
        beforeDatasetsDraw(chart) {
          const { ctx, chartArea } = chart
          const x = chart.scales.x
          const left = x.getPixelForValue(gap[0])
          const right = x.getPixelForValue(gap[1])
          ctx.save()
          ctx.fillStyle = cssColour('paper-deep')
          ctx.fillRect(left, chartArea.top, right - left, chartArea.bottom - chartArea.top)
          ctx.fillStyle = inkSoft
          ctx.font = `11px ${family}`
          ctx.textAlign = 'center'
          ctx.fillText(t('no data'), (left + right) / 2, chartArea.top + 12)
          ctx.strokeStyle = ink
          ctx.lineWidth = 1
          ctx.setLineDash([3, 3])
          for (const mark of marks) {
            const position = x.getPixelForValue(time(mark.date))
            ctx.beginPath()
            ctx.moveTo(position, chartArea.top)
            ctx.lineTo(position, chartArea.bottom)
            ctx.stroke()
            ctx.fillStyle = ink
            ctx.fillText(mark.label, position, chartArea.top - 4)
          }
          ctx.restore()
        },
      },
    ],
  })
}
