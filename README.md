# Backscatter

NISAR L-band radar of the Beni Mellal-Khenifra region of Morocco, turned into maps you can compare
date against date and short readings whose every number comes from a measurement file.
Made by Abdellah Ayad and Khalid Raouf (team InterPixel) for the NASA Space Apps Challenge 2026,
Beni Mellal, challenge "Dancing with the SARs".

The app opens on a start page with two paths. Explore shows three preset areas (the Bin El Ouidane
reservoir, the irrigated Tadla plain and Beni Mellal city) on 9 radar dates: pick two dates, drag the
swipe line, play the series, switch layers, and read what changed next to the evidence behind it.
The Service tab shows a concept for how an agency could ask for its own area; it only prepares the
request as a file, nothing is sent or sold. The Method & Data page lists every threshold, caveat and flag.
The interface runs in English, French and Arabic.

## What is in this repository

```
app/src/            the app: TypeScript, MapLibre GL JS, Chart.js, no framework
app/public/data/    every image and number the app shows (written by our radar processing)
app/public/i18n/    French and Arabic translations of the readings
app/scripts/        check-data, check-translations, and a small local server
app/dist/           the built site, published as is by .github/workflows/pages.yml
Start Backscatter.cmd   Windows launcher for the built site
```

The radar processing (download, speckle filter, water, terrain types, change, statistics) ran in Python
during the hackathon and is not part of this repository. Its outputs are: each area has one evidence
file per date and per pair of dates in `app/public/data/areas/<area>/evidence/`, and `method.json`
holds the method numbers shown on the Method & Data page.

## Run it

The built site needs only Node.js. On Windows, double-click `Start Backscatter.cmd`; it starts a local
server and opens the browser. Elsewhere:

```
cd app
node scripts/serve.mjs dist
```

Opening `index.html` straight from the disk does not work, because browsers block a page opened from a
file from loading its data and map worker. To work on the code:

```
npm --prefix app install
npm --prefix app run dev
npm --prefix app run build
npm --prefix app run check-data
npm --prefix app run check-translations
```

`check-data` lists any file named in `manifest.json` that is missing and any reading whose evidence
hash no longer matches its evidence file. `check-translations` rejects any French or Arabic reading
whose numbers differ from the English. Everything except the background map works offline.

## Data

NISAR L2 GCOV from the NASA ASF DAAC, track 116 ascending, frame 018, HH and HV, 20 m pixels, one pass
every 12 days. NASA has no NISAR data for 27 Jul to 10 Aug 2026, so nothing exists between 16 Jul and
21 Aug. We streamed only our window (about 83 by 86 km) from these 9 granules:

```
NISAR_L2_PR_GCOV_023_116_A_018_2005_DHDH_M_20260622T053824_20260622T053858_P05023_N_F_J_001
NISAR_L2_PR_GCOV_024_116_A_018_2005_DHDH_M_20260704T053823_20260704T053858_P05023_N_F_J_001
NISAR_L2_PR_GCOV_025_116_A_018_2005_DHDH_M_20260716T053822_20260716T053857_P05023_N_F_J_001
NISAR_L2_PR_GCOV_028_116_A_018_2005_DHDH_M_20260821T053820_20260821T053855_P05023_N_F_J_001
NISAR_L2_PR_GCOV_029_116_A_018_2005_DHDH_M_20260902T053820_20260902T053855_P05023_N_F_J_001
NISAR_L2_PR_GCOV_030_116_A_018_2005_DHDH_M_20260914T053820_20260914T053855_P05023_N_F_J_001
NISAR_L2_PR_GCOV_031_116_A_018_2005_DHDH_M_20260926T053820_20260926T053855_P05023_N_F_J_001
NISAR_L2_PR_GCOV_032_116_A_018_2005_DHDH_M_20261008T053820_20261008T053855_P05023_N_F_J_001
NISAR_L2_PR_GCOV_033_116_A_018_2005_DHDH_M_20261020T053820_20261020T053855_P05023_N_F_J_001
```

HLS S30 v2.0 from the NASA LP DAAC, 22 Sep 2026 (4 tiles, cloud cover 0), was used to name the terrain
types and check the water. One HLS photo (Landsat or Sentinel-2) within 5 days of 8 of the 9 radar dates
is shown next to the radar for comparison only: 8 Oct has none, and the 9 Jul photo has sun glint on
the lake. No number in the app comes from these photos.

## Why the pixels are 20 m

We did not choose 20 m. NISAR recorded this track in its 20 MHz mode (the `2005` in every granule
name: 20 MHz on frequency A, 5 MHz on frequency B), and for 20 MHz NASA delivers GCOV on a 20 m grid
(ASF GCOV guide, https://nisar-docs.asf.alaska.edu/gcov/: 5 MHz 80 m, 20 MHz 20 m, 40 MHz 10 m,
77 MHz 20 m). Each 20 m cell averages the single-look samples that fall in it, about 5 m apart along the
track and 6.25 m across in slant range, which lowers speckle; the result is terrain corrected (gamma-0)
and projected to UTM 30N. We cut our window from frequency A on 20 m boundaries without resampling, so
one pixel in our numbers is one NASA pixel, 400 m². The 30 m HLS photos were moved onto that grid, not
the other way round. The app shows the area images at the full 20 m and the whole-window images shrunk
to about 81 m per image pixel; the map collar says which one you are looking at.

## Things that did not behave

- Our first NISAR files, track 44 frame 17, covered only 3 to 5 % of the plain, so we moved to track 116.
  The radar is in UTM 30N and HLS in UTM 29N because Tadla sits on the 6 W zone line; everything is
  measured on the radar grid.
- HV marks dry, rough slopes around the lake as water. Water is mapped from HH only.
- On 16 Jul the lake mask grew lobes into the hills and jumped +19.8 % before we added the Lee filter.
  With the filter the jump is +6.2 %, under the 15 % flag limit, so the date is no longer flagged.
  It is still the largest lake of the series (33.83 km²), with 17.1 % of its outline on dry ground in
  the 22 Sep photo.
- Backscatter rises everywhere in October: mean HH over the window goes from -8.43 dB on 26 Sep to
  -6.92 dB on 20 Oct. It could be rain or processing. We flag it and do not read it as land change.
- Part of the lake outline still lands on dry slopes in the optical photo, probably radar shadow.
  Lake areas are approximate.

## Text in the app

The 135 readings were written ahead of time by Claude (Anthropic) from the numbers in their evidence
files; Claude saw numbers only, never the images. A checker rejected any reading containing a number
or date missing from its evidence file. It does not check that a sentence uses a number correctly, so
the app shows the key numbers and the full evidence next to every reading. Each reading stores the
SHA-256 of its evidence file, and `check-data` confirms they still match. The French and Arabic
readings are translations of the checked English, also made by Claude.

## How AI was used

- Claude (Anthropic) wrote the readings from the evidence files and translated them into French and
  Arabic. Every reading is labelled in the app as written by Claude.
- Claude Code (Anthropic) helped write the processing and app code. The team chose the method and
  checked the numbers on screen against the data files.
- The terrain types come from our own k-means model on radar features (k = 6).

## Sources

- NISAR L2 GCOV: NASA and ISRO, from the NASA ASF DAAC.
- HLS S30 and L30 v2.0 (Sentinel-2 and Landsat 8/9 harmonised): NASA LP DAAC.
- ASF, NISAR GCOV product guide: https://nisar-docs.asf.alaska.edu/gcov/
- NASA Earthdata, "What is Synthetic Aperture Radar?":
  https://www.earthdata.nasa.gov/learn/earth-observation-data-basics/sar
- Bin El Ouidane facts: Wikipedia, "Bin el Ouidane Dam" (CC BY-SA). Canal modernisation: Morocco World News, 28 Sep 2026.
- Basemap: OpenFreeMap tiles in the OpenMapTiles schema, map data © OpenStreetMap contributors (ODbL).

## Licence

Copyright 2026 Abdellah Ayad and Khalid Raouf (team InterPixel). The code, readings and translations
are released under the Apache License 2.0 (see `LICENSE`). Any copy or derived work must keep this
notice and the `NOTICE` file (Apache-2.0, section 4).

| Used for | Package | Version | Licence |
|---|---|---|---|
| map | maplibre-gl | 6.18.0 | BSD-3-Clause |
| charts | chart.js (with @kurkle/color 0.3.4) | 4.6.1 | MIT |
| build | vite | 8.3.8 | MIT |
| build | typescript | 7.0.2 | Apache-2.0 |

NISAR and HLS data are NASA data without use restrictions. The interface uses system fonts; no font is shipped.
