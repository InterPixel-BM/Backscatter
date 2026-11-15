export type LngLat = [number, number]
export type Corners = [LngLat, LngLat, LngLat, LngLat]
export type ByDate = Record<string, string>

export interface CallHours {
  weekday: string
  from: string
  to: string
}

export interface TeamMember {
  name: string
  role?: string
}

export interface AppSettings {
  product_name: string
  statement: string
  team_name: string
  event: string
  placeholders: string[]
  contact_email: string | null
  team_members: TeamMember[]
  call_timezone: string
  call_timezone_label: string
  call_slot_minutes: number
  call_booking_days_ahead: number
  call_hours: CallHours[]
}

export interface Source {
  sensor: string
  wavelength_cm: number
  track: string
  pixel_m: number
  repeat_days: number
  crs_measure?: string
}

export interface LegendEntry {
  value: number
  label: string
  colour: string
}

export interface Layer {
  id: string
  label: string
  kind: 'continuous' | 'categorical' | 'rgb'
  unit?: string
  stretch?: [number, number]
  colormap?: string
  pols?: string[]
  legend?: LegendEntry[]
}

export interface TerrainClass {
  id: number
  name: string
  colour: string
  signature: string
}

export interface Fact {
  fact: string
  source: string
}

export interface AreaFiles {
  hv?: ByDate
  hh?: ByDate
  ratio?: ByDate
  optical?: string
  optical_by_date?: ByDate
  classes?: string
  change?: Record<string, ByDate>
}

export interface Area {
  id: string
  name: string
  region: string
  description: string
  center: LngLat
  radius_km: number
  hero: boolean
  default_dates: [string, string]
  chart: 'water' | 'hv_by_class'
  corners: Corners
  files: AreaFiles
  series?: string
  evidence?: { dates?: ByDate; pairs?: ByDate }
  texts?: { dates?: ByDate; pairs?: ByDate }
  context?: Fact[]
}

export interface OpticalDate {
  radar_date: string
  photo_date: string | null
  sensor: string | null
  cloud_pct: number | null
  glint_deg: number | null
  sun_glint: boolean
}

export interface Manifest {
  contract_version: number
  generated_utc: string
  source: Source
  dates: { date: string; flags: string[] }[]
  flag_text: Record<string, string>
  no_data_window: [string, string]
  optical: { date: string; sensor: string }
  optical_dates?: OpticalDate[]
  colours: Record<string, string>
  layers: Layer[]
  classes: TerrainClass[]
  overview: { corners: Corners; files: { hv?: ByDate; hh?: ByDate; ratio?: ByDate; optical?: string; optical_by_date?: ByDate } }
  areas: Area[]
}

export interface Series {
  area: string
  dates: string[]
  water_km2?: (number | null)[]
  hv_db_by_class?: Record<string, (number | null)[]>
  hh_db_by_class?: Record<string, (number | null)[]>
  flags: string[][]
}

export interface TerrainRow {
  class_id: number
  name: string
  km2: number
  pct: number
  hh_db: number
  hv_db: number
  hv_hh_db: number
}

export interface DateBlock {
  date: string
  area_km2?: number
  with_data_km2?: number
  with_data_pct?: number
  terrain?: TerrainRow[]
  mean_hh_db?: number
  mean_hv_db?: number
  mean_hv_hh_db?: number
  water_km2?: number | null
  flags?: { code: string; text: string }[]
}

export interface Evidence extends DateBlock {
  kind: 'date' | 'pair'
  date_a?: string
  date_b?: string
  days_between?: number
  a?: DateBlock
  b?: DateBlock
  diff?: { mean_hv_db?: number; water_km2?: number | null; water_pct?: number | null }
  brighter_km2?: Record<string, number>
  darker_km2?: Record<string, number>
  by_class?: { class_id: number; brighter_hv_km2: number; darker_hv_km2: number; hv_db_change: number }[]
  caveats?: string[]
  context?: Fact[]
}

export interface KeyNumber {
  label: string
  evidence_field: string
  value: number | string
  unit?: string
}

export interface Text {
  id: string
  kind: 'interpret' | 'compare'
  title: string
  summary: string
  sections: { heading: string; text: string }[]
  key_numbers: KeyNumber[]
  evidence_file: string
  evidence_sha256: string
  check?: { passed: boolean; numbers_checked: number; checker: string }
  label: string
}

export interface Translation {
  lang: string
  source: string
  source_sha256: string
  translated: boolean
  summary: string
  sections: { heading: string; text: string }[]
}

export interface Method {
  speckle?: string
  common_valid_pct?: number
  terrain?: { features?: string[]; k_tested?: number[]; k_chosen?: number; agreement?: { check: string; pct: number }[] }
  water?: { pol?: string; method?: string; flag_area_jump_pct?: number; flag_threshold_jump_db?: number }
  change?: { brighter_db?: number; darker_db?: number; stable_target?: { date: string; hh_db: number; hv_db: number }[] }
  caveats?: string[]
  credits?: ({ what: string; from: string } & Record<string, string | null>)[]
}
