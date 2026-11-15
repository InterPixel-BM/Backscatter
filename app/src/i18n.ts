export type Lang = 'en' | 'fr' | 'ar'

const languages: Lang[] = ['en', 'fr', 'ar']

function stored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

const saved = stored('rot-lang')
export const lang: Lang = languages.includes(saved as Lang) ? (saved as Lang) : 'en'
export const locale = { en: 'en-GB', fr: 'fr-FR', ar: 'ar-MA' }[lang]
export const savedTheme = stored('rot-theme')
export const comma = lang === 'ar' ? '، ' : ', '

export const months = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'],
}[lang]

const fr: Record<string, string> = {
  Explore: 'Explorer',
  'Customized Service': 'Service sur mesure',
  'Method & Data': 'Méthode et données',
  Sections: 'Sections',
  Language: 'Langue',
  'Light mode': 'Mode clair',
  'Dark mode': 'Mode sombre',
  'NISAR L-band radar of the same place on two dates, what changed, and the measurements behind every sentence.':
    'Le radar NISAR en bande L sur un même lieu à deux dates, ce qui a changé, et les mesures derrière chaque phrase.',
  '{what}: not generated yet.': '{what} : pas encore générés.',
  'Text in English, as generated and checked.': 'Texte en anglais, tel qu’il a été généré et vérifié.',

  'Swipe line between Date A (left) and Date B (right)': 'Ligne de balayage entre la date A (gauche) et la date B (droite)',
  '{n} % of the width shows Date A': '{n} % de la largeur montre la date A',
  'Basemap offline: radar layers only.': 'Fond de carte hors ligne : couches radar seulement.',
  'Loading radar image...': 'Chargement de l’image radar...',
  'A radar image could not be loaded.': 'Une image radar n’a pas pu être chargée.',
  'Cursor {lat}, {lon}': 'Curseur {lat}, {lon}',
  'Cursor: move over the map': 'Curseur : passez sur la carte',
  N: 'N',
  S: 'S',
  E: 'E',
  W: 'O',

  'Lake area': 'Surface du lac',
  Date: 'Date',
  'no value': 'pas de valeur',
  'no data': 'pas de données',
  'Flagged: {text}': 'Signalée : {text}',
  ', flagged': ', signalée',

  'Brighter means more signal came back. HV rises when the pulse bounces around inside a volume such as crops, shrubs or trees. Calm water and smooth bare soil stay dark.':
    'Plus clair veut dire plus de signal renvoyé. HV augmente quand l’impulsion rebondit dans un volume comme les cultures, les buissons ou les arbres. L’eau calme et le sol nu lisse restent sombres.',
  'Calm water reflects the pulse away from the radar and looks dark. Rough ground is brighter. Buildings facing the radar can be very bright, because walls and ground act as a corner reflector.':
    'L’eau calme renvoie l’impulsion loin du radar et paraît sombre. Le sol rugueux est plus clair. Les bâtiments face au radar peuvent être très clairs, car les murs et le sol forment un réflecteur en coin.',
  'HV:HH compares the two. It is higher where vegetation volume dominates and lower on bare ground and buildings.':
    'HV:HH compare les deux. Il est plus élevé là où domine le volume de végétation, plus bas sur le sol nu et les bâtiments.',
  'Each colour is one terrain type from our k-means model on the radar features. The names come from comparing the classes with the optical photo. Method & Data has the details.':
    'Chaque couleur est un type de terrain issu de notre modèle k-means sur les caractéristiques radar. Les noms viennent de la comparaison avec la photo optique. Détails dans Méthode et données.',
  'Pixels that got brighter or darker than the threshold between Date A and Date B. Crops, harvest, water level, soil moisture and rain can all do this, so read the map with the flags and the text.':
    'Pixels devenus plus clairs ou plus sombres que le seuil entre la date A et la date B. Cultures, récolte, niveau d’eau, humidité du sol et pluie peuvent tous en être la cause : lisez la carte avec les signalements et le texte.',
  'A natural-colour photo from an optical satellite, for comparison. Optical needs daylight and a clear sky. The radar sees through cloud and at night.':
    'Une photo en couleurs naturelles d’un satellite optique, pour comparer. L’optique a besoin de jour et d’un ciel clair. Le radar voit à travers les nuages et de nuit.',
  'Area, dates and layer': 'Zone, dates et couche',
  Interpretation: 'Interprétation',
  Map: 'Carte',
  'Areas, dates and layers': 'Zones, dates et couches',
  'Radar layers: not generated yet.': 'Couches radar : pas encore générées.',
  'Optical photo, nearest clear date': 'Photo optique, date claire la plus proche',
  'No clear optical photo near this date': 'Pas de photo optique claire près de cette date',
  'No clear photo (radar {date})': 'Pas de photo claire (radar {date})',
  'Photo {photo} (radar {radar})': 'Photo {photo} (radar {radar})',
  ', sun glint': ', reflet du soleil',
  Area: 'Zone',
  'Whole radar window': 'Toute la fenêtre radar',
  '{track}, {n} preset areas': '{track}, {n} zones prédéfinies',
  'Two dates, A and B': 'Deux dates, A et B',
  'One date': 'Une date',
  'No NISAR data {from} to {to}': 'Pas de données NISAR du {from} au {to}',
  'Date A, {name}': 'Date A, {name}',
  'Date B, {name}': 'Date B, {name}',
  'Flagged date': 'Date signalée',
  'Radar date': 'Date radar',
  'Flagged: read with care.': 'Signalée : à lire avec prudence.',
  Stop: 'Arrêter',
  Pause: 'Pause',
  Resume: 'Reprendre',
  'Play all {n} dates': 'Lire les {n} dates',
  ' Next: {date}, after the gap with no NISAR data.': ' Suivante : {date}, après la période sans données NISAR.',
  Dates: 'Dates',
  Layer: 'Couche',
  'Change in: ': 'Changement en : ',
  Opacity: 'Opacité',
  '{label} overview, {date}': '{label}, vue d’ensemble, {date}',
  '{label}, {area}, {date}': '{label}, {area}, {date}',
  '{label}, overview': '{label}, vue d’ensemble',
  '{label}, {area}': '{label}, {area}',
  '{label}: drawn per area, choose an area.': '{label} : dessiné par zone, choisissez une zone.',
  '{label} ({pol}), {area}': '{label} ({pol}), {area}',
  '{what} (radar {date}).': '{what} (radar {date}).',
  'Backscatter, same stretch for every date.': 'Rétrodiffusion, même étirement pour toutes les dates.',
  '{prefix}{photo}: {sensor}, {cloud} % cloud on its cloudiest tile, natural colour.':
    '{prefix}{photo} : {sensor}, {cloud} % de nuages sur sa tuile la plus nuageuse, couleurs naturelles.',
  'Sun glint on {date}: the sun was reflected off the water toward the satellite (glint angle {deg}°), so water looks pale blue instead of dark.':
    'Reflet du soleil le {date} : le soleil s’est réfléchi sur l’eau vers le satellite (angle de reflet {deg}°), l’eau paraît donc bleu pâle au lieu de sombre.',
  '{sensor}, {date}, natural colour.': '{sensor}, {date}, couleurs naturelles.',
  'Under it: {label}, {date}.': 'En dessous : {label}, {date}.',
  'Change from A {a} to B {b}, in {pol}.': 'Changement de A {a} à B {b}, en {pol}.',
  'Left of the line: A {a}. Right: B {b}.': 'À gauche de la ligne : A {a}. À droite : B {b}.',
  'Date: {date}.': 'Date : {date}.',
  'The swipe compares two dates of {layers}.': 'Le balayage compare deux dates de {layers}.',
  'How to read this layer': 'Comment lire cette couche',
  '{n} days between A and B.': '{n} jours entre A et B.',
  'NASA gap: no NISAR data from {from} to {to}, so nothing between {before} and {after}.':
    'Lacune NASA : pas de données NISAR du {from} au {to}, donc rien entre le {before} et le {after}.',
  'No clear optical photo near {dates}: not available with this layer.':
    'Pas de photo optique claire près du {dates} : indisponible avec cette couche.',
  '{i} of {n}: {when}{flagged}.': '{i} sur {n} : {when}{flagged}.',
  'Play works with {layers}.': 'La lecture fonctionne avec {layers}.',
  HV: 'HV',
  HH: 'HH',
  'HV:HH ratio': 'Rapport HV:HH',
  'Terrain types': 'Types de terrain',
  'Change A to B': 'Changement de A à B',
  'Optical photo, 22 Sep 2026': 'Photo optique, 22 sept. 2026',
  'Brighter (> +3 dB)': 'Plus clair (> +3 dB)',
  'Darker (< -3 dB)': 'Plus sombre (< -3 dB)',

  'Days between': 'Jours d’écart',
  'Brighter in HV': 'Plus clair en HV',
  'Darker in HV': 'Plus sombre en HV',
  'Brighter in HH': 'Plus clair en HH',
  'Darker in HH': 'Plus sombre en HH',
  'Water change': 'Changement de l’eau',
  'Mean HV change': 'Changement moyen de HV',
  'Area of the circle': 'Surface du cercle',
  'With radar data': 'Avec données radar',
  Water: 'Eau',
  'Mean HH': 'HH moyen',
  'Mean HV': 'HV moyen',
  'Mean HV:HH': 'HV:HH moyen',
  days: 'jours',
  'Terrain mix: {list}': 'Répartition du terrain : {list}',
  Type: 'Type',
  Reading: 'Lecture',
  'This date': 'Cette date',
  'A vs B': 'A contre B',
  'A, {date}': 'A, {date}',
  'B, {date}': 'B, {date}',
  'Loading...': 'Chargement...',
  'Choose an area in the list or click a circle on the map to read what the radar shows there.':
    'Choisissez une zone dans la liste ou cliquez sur un cercle de la carte pour lire ce que le radar y montre.',
  '{a} to {b}, {n} days': '{a} au {b}, {n} jours',
  'Comparison text': 'Texte de comparaison',
  'Interpretation text': 'Texte d’interprétation',
  'Caveats ({n})': 'Réserves ({n})',
  'Key numbers': 'Chiffres clés',
  'Straight from the evidence file.': 'Directement tirés du fichier de preuves.',
  'Terrain mix': 'Répartition du terrain',
  'Time series': 'Série temporelle',
  Evidence: 'Preuves',
  'Lake area by date (km²)': 'Surface du lac par date (km²)',
  'Mean HV by terrain type (dB)': 'HV moyen par type de terrain (dB)',
  '{title}, {n} dates from {from} to {to}. The dashed stretch crosses the period with no data. Flagged dates are amber diamonds. Values are in the table below.':
    '{title}, {n} dates du {from} au {to}. Le tronçon en pointillé traverse la période sans données. Les dates signalées sont des losanges ambre. Les valeurs sont dans le tableau ci-dessous.',
  'Chart values': 'Valeurs du graphique',
  'Show evidence': 'Voir les preuves',
  'File: {path}': 'Fichier : {path}',
  'SHA-256 of the evidence used for the text: {hash}': 'SHA-256 des preuves utilisées pour le texte : {hash}',
  'Number check: {result}, {n} numbers checked by {checker}.': 'Vérification des chiffres : {result}, {n} chiffres vérifiés par {checker}.',
  passed: 'réussie',
  failed: 'échouée',
  'Interpretation written by Claude (Anthropic) from the measurements shown. Generated in advance for this prototype.':
    'Interprétation rédigée par Claude (Anthropic) à partir des mesures affichées. Générée à l’avance pour ce prototype.',

  'Water agency': 'Agence de l’eau',
  'Agriculture office': 'Office agricole',
  Insurance: 'Assurance',
  Research: 'Recherche',
  Other: 'Autre',
  'Choose a sector': 'Choisissez un secteur',
  'Terrain interpretation': 'Interprétation du terrain',
  'Change comparison between dates': 'Comparaison des changements entre dates',
  'Monitoring at each NISAR pass': 'Suivi à chaque passage de NISAR',
  'Monitoring at each NISAR pass (every {n} days)': 'Suivi à chaque passage de NISAR (tous les {n} jours)',
  'Other (describe in the problem field)': 'Autre (à décrire dans le champ du problème)',
  'Service type (choose one or more)': 'Type de service (un ou plusieurs)',
  'Report language': 'Langue du rapport',
  Consent: 'Consentement',
  ' I agree that {team} uses these details only to answer this request and prepare the call.':
    ' J’accepte que {team} utilise ces informations uniquement pour répondre à cette demande et préparer l’appel.',
  'Choose a day': 'Choisissez un jour',
  'Choose a time': 'Choisissez une heure',
  'Choose a day first': 'Choisissez d’abord un jour',
  '{start} to {end}': '{start} à {end}',
  'Prototype: requests are not stored or sent automatically.': 'Prototype : les demandes ne sont ni enregistrées ni envoyées automatiquement.',
  'Who is asking': 'Demandeur',
  Organisation: 'Organisme',
  Sector: 'Secteur',
  'Contact name': 'Nom du contact',
  Email: 'E-mail',
  'Phone (optional)': 'Téléphone (facultatif)',
  'Country or region': 'Pays ou région',
  'Area of interest': 'Zone d’intérêt',
  'Place name': 'Nom du lieu',
  'Click the map to set the centre, or type its coordinates. Drag the pin to move it.':
    'Cliquez sur la carte pour placer le centre, ou saisissez ses coordonnées. Faites glisser l’épingle pour la déplacer.',
  'Centre latitude': 'Latitude du centre',
  'Centre longitude': 'Longitude du centre',
  'Radius (km)': 'Rayon (km)',
  'What you need': 'Votre besoin',
  'Time horizon, from': 'Période, du',
  to: 'au',
  'Problem description': 'Description du problème',
  'What decision should the radar help with? What do you already know about the area?':
    'Quelle décision le radar doit-il éclairer ? Que savez-vous déjà de la zone ?',
  'Discovery call ({n} minutes, {zone})': 'Appel de découverte ({n} minutes, {zone})',
  Day: 'Jour',
  Time: 'Heure',
  'Review request': 'Vérifier la demande',
  'Request summary': 'Résumé de la demande',
  'A concept for a future service: an agency could ask for radar maps of its own area and dates, with a terrain interpretation, change comparisons between dates, and monitoring at each NISAR pass, every {n} days, anywhere NISAR covers.':
    'Un concept de service futur : une agence pourrait demander des cartes radar de sa propre zone et de ses dates, avec une interprétation du terrain, des comparaisons de changements entre dates et un suivi à chaque passage de NISAR, tous les {n} jours, partout où NISAR couvre.',
  'It would be meant for water agencies, agriculture offices, insurers and researchers.':
    'Il s’adresserait aux agences de l’eau, aux offices agricoles, aux assureurs et aux chercheurs.',
  'This form shows what such a request would contain. You can fill it in and download it as a file.':
    'Ce formulaire montre ce que contiendrait une telle demande. Vous pouvez le remplir et le télécharger sous forme de fichier.',
  'Send the request below and book a {n}-minute discovery call. On the call we go through your area, your dates and what the radar can and cannot show there.':
    'Envoyez la demande ci-dessous et réservez un appel de découverte de {n} minutes. Pendant l’appel, nous examinons votre zone, vos dates et ce que le radar peut et ne peut pas y montrer.',
  'Nothing is sold or offered here. Explore shows the preset areas only; no custom analysis runs in this prototype.':
    'Rien n’est vendu ni proposé ici. Explorer montre seulement les zones prédéfinies ; aucune analyse sur mesure n’est faite dans ce prototype.',
  'Enter the organisation name.': 'Indiquez le nom de l’organisme.',
  'Choose a sector.': 'Choisissez un secteur.',
  'Enter a contact name.': 'Indiquez un nom de contact.',
  'Enter an email address, for example name@agency.org.': 'Indiquez une adresse e-mail, par exemple nom@agence.org.',
  'Enter a country or region.': 'Indiquez un pays ou une région.',
  'Enter a place name.': 'Indiquez un nom de lieu.',
  'Click the map or type a latitude between -90 and 90.': 'Cliquez sur la carte ou saisissez une latitude entre -90 et 90.',
  'Type a longitude between -180 and 180.': 'Saisissez une longitude entre -180 et 180.',
  'Enter a radius in km, greater than 0.': 'Indiquez un rayon en km, supérieur à 0.',
  'Choose a start date.': 'Choisissez une date de début.',
  'Choose an end date.': 'Choisissez une date de fin.',
  'The end date must be after the start date.': 'La date de fin doit suivre la date de début.',
  'Choose at least one service type.': 'Choisissez au moins un type de service.',
  'Describe the problem in a few sentences.': 'Décrivez le problème en quelques phrases.',
  'Choose a day for the call.': 'Choisissez un jour pour l’appel.',
  'Choose a time for the call.': 'Choisissez une heure pour l’appel.',
  'Tick the box to agree.': 'Cochez la case pour accepter.',
  Phone: 'Téléphone',
  'not given': 'non indiqué',
  'Centre (lat, lon)': 'Centre (lat, lon)',
  Radius: 'Rayon',
  'Time horizon': 'Période',
  Services: 'Services',
  Problem: 'Problème',
  'Discovery call': 'Appel de découverte',
  given: 'donné',
  'Download request (JSON)': 'Télécharger la demande (JSON)',
  'Send by email': 'Envoyer par e-mail',
  'Edit request': 'Modifier la demande',
  'Request ready to send': 'Demande prête à envoyer',
  'Check the details. Nothing has left this page yet. Download the request or open it in your email program.':
    'Vérifiez les informations. Rien n’a encore quitté cette page. Téléchargez la demande ou ouvrez-la dans votre messagerie.',
  'Check the details. Nothing has left this page yet. Download the request as a file.':
    'Vérifiez les informations. Rien n’a encore quitté cette page. Téléchargez la demande sous forme de fichier.',
  'Check: ': 'À vérifier : ',

  Measure: 'Mesurer',
  code: 'code',
  Claude: 'Claude',
  app: 'appli',
  'Clean the radar, sort terrain into classes with our k-means model, map water, measure change, compute statistics.':
    'Nettoyer le radar, classer le terrain avec notre modèle k-means, cartographier l’eau, mesurer le changement, calculer les statistiques.',
  'Write one JSON file per area and date, and per area and date pair, with every number a text may use.':
    'Écrire un fichier JSON par zone et date, et par zone et paire de dates, avec chaque chiffre qu’un texte peut utiliser.',
  Interpret: 'Interpréter',
  'Claude writes each text from its evidence file only, with fixed templates. It sees statistics, never images.':
    'Claude rédige chaque texte à partir de son seul fichier de preuves, avec des modèles fixes. Il voit des statistiques, jamais d’images.',
  Check: 'Vérifier',
  'A script pulls every number and date out of each text and rejects the text if one is not in its evidence.':
    'Un script extrait chaque chiffre et chaque date de chaque texte et rejette le texte si l’un d’eux n’est pas dans ses preuves.',
  Display: 'Afficher',
  'The text, its key numbers, the label and the full evidence are shown together.':
    'Le texte, ses chiffres clés, la mention et les preuves complètes sont affichés ensemble.',
  'NISAR radar, HH and HV': 'Le radar NISAR, HH et HV',
  "NISAR carries an L-band radar with a wavelength of {cm} cm. It sends its own microwave pulses, so it sees the ground through cloud and at night. We use {sensor} data, track {track}, {px} m pixels, one pass every {days} days. Areas are measured in the radar's own grid, {crs}.":
    'NISAR embarque un radar en bande L d’une longueur d’onde de {cm} cm. Il émet ses propres impulsions micro-ondes et voit donc le sol à travers les nuages et de nuit. Nous utilisons les données {sensor}, trace {track}, pixels de {px} m, un passage tous les {days} jours. Les surfaces sont mesurées dans la grille du radar, {crs}.',
  'Sensor details': 'Détails du capteur',
  'HH: sent horizontal, received horizontal. Calm water reflects the pulse away from the radar and looks dark. Rough ground and buildings send more back.':
    'HH : émis à l’horizontale, reçu à l’horizontale. L’eau calme renvoie l’impulsion loin du radar et paraît sombre. Le sol rugueux et les bâtiments en renvoient davantage.',
  'HV: sent horizontal, received vertical. The signal changes polarisation when it bounces around inside a volume such as a crop canopy or shrubs, so HV rises with vegetation and stays low on water and smooth bare soil.':
    'HV : émis à l’horizontale, reçu à la verticale. Le signal change de polarisation en rebondissant dans un volume comme un couvert végétal ou des buissons : HV augmente avec la végétation et reste bas sur l’eau et le sol nu lisse.',
  'HV:HH is the ratio of the two. All values are backscatter in dB, averaged in linear power before converting to dB.':
    'HV:HH est le rapport des deux. Toutes les valeurs sont des rétrodiffusions en dB, moyennées en puissance linéaire avant conversion en dB.',
  'Dates used ({n}): {dates}. NISAR has no data from {from} to {to}.': 'Dates utilisées ({n}) : {dates}. NISAR n’a pas de données du {from} au {to}.',
  'Date list': 'Liste des dates',
  'Speckle filter: {filter}. Pixels used in every comparison: valid on all dates, {pct} % of the window.':
    'Filtre de chatoiement : {filter}. Pixels utilisés dans chaque comparaison : valides à toutes les dates, {pct} % de la fenêtre.',
  'Speckle and valid pixels': 'Chatoiement et pixels valides',
  'Terrain types, our model': 'Types de terrain, notre modèle',
  'k-means clustering with these features: {features}. Tested k = {tested}; chosen k = {k}. Each cluster was named by comparing it with the optical photo.':
    'Regroupement k-means avec ces caractéristiques : {features}. k testés = {tested} ; k retenu = {k}. Chaque groupe a été nommé par comparaison avec la photo optique.',
  'Agreement check': 'Contrôle de concordance',
  'Terrain model numbers': 'Chiffres du modèle de terrain',
  Class: 'Classe',
  'Why it looks this way in HH and HV': 'Pourquoi elle apparaît ainsi en HH et HV',
  'Terrain classes': 'Classes de terrain',
  'Mapped from {pol} only.': 'Cartographiée à partir de {pol} seulement.',
  'A date is flagged when the lake area changes by more than {pct} % from the previous date, or its threshold moves by more than {db} dB. These limits are our method choice.':
    'Une date est signalée quand la surface du lac change de plus de {pct} % par rapport à la date précédente, ou quand son seuil bouge de plus de {db} dB. Ces limites sont un choix de méthode.',
  'Water method numbers': 'Chiffres de la méthode de l’eau',
  'Change between two dates': 'Changement entre deux dates',
  'Per-pixel difference in dB on the filtered radar. Brighter: more than +{up} dB. Darker: less than {down} dB. These thresholds are our method choice.':
    'Différence par pixel en dB sur le radar filtré. Plus clair : plus de +{up} dB. Plus sombre : moins de {down} dB. Ces seuils sont un choix de méthode.',
  'Stable-target check: median backscatter over the built-up class on each date. Buildings should change little, so a shift there points to weather or processing rather than land change.':
    'Contrôle sur cibles stables : rétrodiffusion médiane sur la classe bâtie à chaque date. Les bâtiments changent peu ; un décalage y indique la météo ou le traitement plutôt qu’un changement du sol.',
  'HH dB': 'HH dB',
  'HV dB': 'HV dB',
  'Change method numbers': 'Chiffres de la méthode de changement',
  'no date': 'aucune date',
  'Caveats and flags': 'Réserves et signalements',
  Caveats: 'Réserves',
  Flags: 'Signalements',
  'About the texts': 'À propos des textes',
  'The interpretation and comparison texts are written by Claude (Anthropic) from the evidence file of each area and date. The model receives numbers only, never the radar images. Possible causes are labelled as such, and flagged dates are described with lower confidence.':
    'Les textes d’interprétation et de comparaison sont rédigés par Claude (Anthropic) à partir du fichier de preuves de chaque zone et date. Le modèle ne reçoit que des chiffres, jamais les images radar. Les causes possibles sont présentées comme telles, et les dates signalées sont décrites avec moins de certitude.',
  'In this prototype the texts are generated in advance, because live calls need a paid API key and a server. The templates are the same ones a live service would send to the Claude API, for any area.':
    'Dans ce prototype, les textes sont générés à l’avance, car des appels en direct demandent une clé d’API payante et un serveur. Les modèles sont ceux qu’un service en direct enverrait à l’API de Claude, pour n’importe quelle zone.',
  'A script rejects any text that contains a number or date missing from its evidence file. It does not check that a sentence uses a number correctly, so the evidence and the key numbers are shown next to every text.':
    'Un script rejette tout texte qui contient un chiffre ou une date absents de son fichier de preuves. Il ne vérifie pas qu’une phrase utilise correctement un chiffre ; c’est pourquoi les preuves et les chiffres clés sont affichés à côté de chaque texte.',
  'The texts are in English. A translated text would need its own check against the evidence.':
    'Les textes sont en anglais. Un texte traduit demanderait sa propre vérification par rapport aux preuves.',
  'Texts in this build: {n}.': 'Textes dans cette version : {n}.',
  Texts: 'Textes',
  'Data and credits': 'Données et crédits',
  'Data credits': 'Crédits des données',
  Team: 'Équipe',
  'How every map, number and sentence in Explore is made, and where it can be wrong.':
    'Comment chaque carte, chiffre et phrase d’Explorer est produit, et où cela peut être faux.',
  'From radar to text in five steps': 'Du radar au texte en cinq étapes',
  'Translated by Claude from the checked English text. Its numbers match the English.':
    'Traduit par Claude à partir du texte anglais vérifié. Ses chiffres sont identiques à ceux de l’anglais.',
  'The texts were written in English. The French and Arabic versions are translations whose numbers are checked against the English.':
    'Les textes ont été rédigés en anglais. Les versions française et arabe sont des traductions dont les chiffres sont vérifiés par rapport à l’anglais.',

  'NASA Space Apps Challenge 2026, Beni Mellal, challenge "Dancing with the SARs"': 'NASA Space Apps Challenge 2026, Beni Mellal, défi « Dancing with the SARs »',
  'Bin El Ouidane reservoir': 'Retenue de Bin El Ouidane',
  'Tadla irrigated plain, Beni Moussa side': 'Plaine irriguée du Tadla, côté Beni Moussa',
  'Beni Mellal city and foothills': 'Ville de Beni Mellal et piémont',
  'Beni Mellal-Khenifra, Morocco': 'Béni Mellal-Khénifra, Maroc',
  'The reservoir on the El Abid river and its shore.': 'La retenue sur l’oued El Abid et ses rives.',
  'Irrigated fields of the Tadla plain, where the photo shows green fields.': 'Champs irrigués de la plaine du Tadla, là où la photo montre des champs verts.',
  'Beni Mellal city and the hills next to it.': 'La ville de Beni Mellal et les collines voisines.',
  'Open water': 'Eau libre',
  'Built-up': 'Bâti',
  'Trees, shrub and rugged slopes': 'Arbres, broussailles et pentes accidentées',
  'Changing fields': 'Champs changeants',
  'Rough dry ground and fields': 'Sol sec rugueux et champs',
  'Smooth bare ground and dry fields': 'Sol nu lisse et champs secs',
  'Calm water reflects the pulse away from the radar, so the lake is among the darkest surfaces in HH and HV. Wind can roughen the surface and brighten it a little. At L-band smooth dry fields can be nearly as dark, so water is mapped from the connected lake shape, not from brightness alone.':
    'L’eau calme renvoie l’impulsion loin du radar : le lac est donc parmi les surfaces les plus sombres en HH et HV. Le vent peut rider la surface et l’éclaircir un peu. En bande L, des champs secs et lisses peuvent être presque aussi sombres ; l’eau est donc cartographiée à partir de la forme continue du lac, pas de la seule luminosité.',
  'Walls and the ground beside them act as corner reflectors that send the pulse straight back (double bounce), so HH is very bright. HV stays much lower, which gives the lowest HV:HH ratio of all types. Isolated farm buildings show up as bright points on the plain.':
    'Les murs et le sol à leur pied forment des réflecteurs en coin qui renvoient l’impulsion droit vers le radar (double rebond) : HH est donc très clair. HV reste bien plus bas, ce qui donne le rapport HV:HH le plus faible de tous les types. Les bâtiments agricoles isolés apparaissent comme des points clairs dans la plaine.',
  'Leaves and branches scatter the pulse in many directions (volume scattering), which raises HV the most of all land types. Slopes facing the radar look bright in both channels. Tall crops and tree plots on the plain can fall in this type too.':
    'Les feuilles et les branches diffusent l’impulsion dans de nombreuses directions (diffusion de volume), ce qui élève HV plus que pour tout autre type de terrain. Les pentes face au radar paraissent claires dans les deux canaux. Les hautes cultures et les parcelles d’arbres de la plaine peuvent aussi tomber dans ce type.',
  'HV changed strongly between June and September, as it does when a crop grows (more volume scattering) or is harvested or ploughed (less). These are the fields with the most activity in the season. Which crop it is cannot be told from the radar alone.':
    'HV a fortement changé entre juin et septembre, comme lorsqu’une culture pousse (plus de diffusion de volume) ou est récoltée ou labourée (moins). Ce sont les champs les plus actifs de la saison. Le radar seul ne permet pas de dire de quelle culture il s’agit.',
  'Rough soil, stones and sparse plants send part of the pulse back (rough surface scattering), so HH and HV are medium. Little change from June to September. Found on dry fields of the plain and on stony ridges.':
    'Le sol rugueux, les pierres et une végétation clairsemée renvoient une partie de l’impulsion (diffusion de surface rugueuse) : HH et HV sont donc moyens. Peu de changement de juin à septembre. On le trouve sur les champs secs de la plaine et sur les crêtes pierreuses.',
  'Smooth dry soil reflects most of the pulse away, so HH and HV are low, close to calm water. Little change from June to September, which fits fallow or harvested land. The optical photo shows most of this type as bright bare soil.':
    'Le sol sec et lisse renvoie la plus grande partie de l’impulsion ailleurs : HH et HV sont donc bas, proches de l’eau calme. Peu de changement de juin à septembre, ce qui correspond à des terres en jachère ou récoltées. La photo optique montre la plupart de ce type comme du sol nu clair.',
  'Lake mask area changes more than 15% from the previous date': 'La surface du masque du lac change de plus de 15 % par rapport à la date précédente',
  'Lake water threshold moves more than 1.0 dB from the previous date': 'Le seuil de l’eau du lac bouge de plus de 1.0 dB par rapport à la date précédente',
  'Backscatter over built-up land shifts more than 0.5 dB from its June-September median: possible processing offset or widespread wet conditions':
    'La rétrodiffusion sur le bâti s’écarte de plus de 0.5 dB de sa médiane de juin à septembre : possible décalage de traitement ou conditions humides généralisées',
  'What the radar shows here': 'Ce que montre le radar ici',
  'Terrain types and what they mean': 'Types de terrain et leur signification',
  'Data quality notes': 'Notes sur la qualité des données',
  'What changed': 'Ce qui a changé',
  'Where, by terrain type': 'Où, par type de terrain',
  'Possible causes': 'Causes possibles',
  Limits: 'Limites',
  'What an agency could do next': 'Ce qu’une agence pourrait faire ensuite',
  'Area with data': 'Surface avec données',
  'Lake outline on dry land': 'Contour du lac sur terre sèche',
  'Lake change': 'Changement du lac',
  'Mean HH change': 'Changement moyen de HH',
  'NASA has no NISAR data for 27 Jul to 10 Aug 2026, so this series has nothing between 16 Jul and 21 Aug.':
    'La NASA n’a pas de données NISAR du 27 juil. au 10 août 2026 : cette série n’a donc rien entre le 16 juil. et le 21 août.',
  'One track only (116 asc frame 018); every date sees the ground from the same side, so slopes facing away from the radar can fall in radar shadow.':
    'Une seule trace (116 asc frame 018) : chaque date voit le sol du même côté, si bien que les pentes opposées au radar peuvent tomber dans l’ombre radar.',
  'Mean HH over the whole window rises from -8.43 dB on 2026-09-26 to -7.5 dB on 2026-10-08 and -6.92 dB on 2026-10-20. The cause is not known (rain or processing); these dates are flagged and not read as land change.':
    'Le HH moyen sur toute la fenêtre passe de -8.43 dB le 2026-09-26 à -7.5 dB le 2026-10-08 et -6.92 dB le 2026-10-20. La cause n’est pas connue (pluie ou traitement) : ces dates sont signalées et ne sont pas lues comme un changement du sol.',
  'bin-el-ouidane: 8.2 to 17.1% of the radar lake outline falls on land in the 22 Sep optical photo (likely radar shadow on slopes); lake areas are approximate.':
    'bin-el-ouidane : 8.2 à 17.1 % du contour radar du lac tombe sur la terre ferme dans la photo optique du 22 sept. (probablement l’ombre radar sur les pentes) ; les surfaces du lac sont approximatives.',
  'Dates flagged for a backscatter shift over built-up land: 2026-10-08, 2026-10-20.':
    'Dates signalées pour un décalage de rétrodiffusion sur le bâti : 2026-10-08, 2026-10-20.',
  'Check with one date outside the series, 2026-11-01 (processing P05036, the series is P05023): mean HH over the window is -8.5 dB and built-up HH is -0.11 dB from its June-September median, back at the summer level. With a different processing code, this cannot tell a surface that dried from a processing change.':
    'Contrôle avec une date hors série, 2026-11-01 (traitement P05036, la série est en P05023) : le HH moyen sur la fenêtre est de -8.5 dB et le HH du bâti est à -0.11 dB de sa médiane de juin à septembre, revenu au niveau de l’été. Avec un code de traitement différent, cela ne permet pas de distinguer une surface qui a séché d’un changement de traitement.',
  'NISAR L2 GCOV: NASA ASF DAAC (track 116 ascending frame 018)': 'NISAR L2 GCOV : NASA ASF DAAC (trace 116 ascendante, cadre 018)',
  'HLS S30 v2.0 natural colour: NASA LP DAAC (22 Sep 2026)': 'HLS S30 v2.0 couleurs naturelles : NASA LP DAAC (22 sept. 2026)',
  'Basemap: OpenFreeMap (map data OpenStreetMap contributors)': 'Fond de carte : OpenFreeMap (données des contributeurs d’OpenStreetMap)',
  'Optical photos near the radar dates: {sensors}, from NASA LP DAAC.': 'Photos optiques proches des dates radar : {sensors}, de NASA LP DAAC.',
  'Pixel spacing by bandwidth: ASF, NISAR GCOV product guide, {url}': 'Pas des pixels selon la bande : ASF, guide du produit NISAR GCOV, {url}',
  Start: 'Accueil',
  'What would you like to do?': 'Que voulez-vous faire ?',
  'For anyone curious': 'Pour les curieux',
  'Look at the preset maps': 'Voir les cartes prêtes',
  '{area}, HV radar, {date}': '{area}, radar HV, {date}',
  '{area}, HV radar on two dates, same stretch on both.': '{area}, radar HV à deux dates, même étirement pour les deux.',
  'Swipe between {n} NISAR radar dates, {from} to {to}, over {areas}. Every map comes with a short reading, the numbers behind it and its flags.':
    'Faites glisser entre {n} dates radar NISAR, du {from} au {to}, sur {areas}. Chaque carte est accompagnée d’une courte lecture, des chiffres qui la fondent et de ses signalements.',
  'Explore the maps': 'Explorer les cartes',
  'For agencies, companies and researchers': 'Pour les agences, les entreprises et les chercheurs',
  'Ask for a custom interpretation': 'Demander une interprétation sur mesure',
  'A concept for a future service: describe your own area, your dates and the decision the radar should help with.':
    'Un concept de service futur : décrivez votre zone, vos dates et la décision que le radar doit aider à prendre.',
  'Area of interest: a centre on the map and a radius': 'Zone d’intérêt : un centre sur la carte et un rayon',
  'Time horizon and service type': 'Horizon temporel et type de service',
  'Report language: English, French or Arabic': 'Langue du rapport : anglais, français ou arabe',
  'In this prototype the request is prepared as a file. Nothing is sent, sold or stored.':
    'Dans ce prototype, la demande est préparée sous forme de fichier. Rien n’est envoyé, vendu ni conservé.',
  'Prepare a request': 'Préparer une demande',
  '{sensor}, {wavelength} cm wavelength, {px} m pixels, one pass every {days} days.':
    '{sensor}, longueur d’onde {wavelength} cm, pixels de {px} m, un passage tous les {days} jours.',
  'Why {px} m pixels?': 'Pourquoi des pixels de {px} m ?',
  'How every number is made': 'Comment chaque chiffre est obtenu',
  'Radar pixel: {px} m × {px} m.': 'Pixel radar : {px} m × {px} m.',
  'Area image: 1 image pixel = 1 radar pixel.': 'Image de la zone : 1 pixel d’image = 1 pixel radar.',
  'Area image: 1 image pixel ≈ {m} m.': 'Image de la zone : 1 pixel d’image ≈ {m} m.',
  'Whole window: 1 image pixel ≈ {m} m, shrunk to load fast.': 'Fenêtre entière : 1 pixel d’image ≈ {m} m, réduite pour charger vite.',
  'Optical photos are 30 m, moved onto the radar grid.': 'Les photos optiques font 30 m, ramenées sur la grille radar.',
  'Why {px} m?': 'Pourquoi {px} m ?',
  'Pixel size: why {px} m': 'Taille du pixel : pourquoi {px} m',
  'We did not pick {px} m: it is the grid NASA delivers for our data. NISAR recorded track {track} in its 20 MHz mode, written 2005 in every file name (20 MHz on the main band, frequency A, which we use; 5 MHz on the second band). For a 20 MHz acquisition the GCOV product is posted at {px} m.':
    'Nous n’avons pas choisi {px} m : c’est la grille que la NASA livre pour nos données. NISAR a enregistré la trace {track} dans son mode 20 MHz, noté 2005 dans chaque nom de fichier (20 MHz sur la bande principale, la fréquence A, que nous utilisons ; 5 MHz sur la seconde bande). Pour une acquisition à 20 MHz, le produit GCOV est livré au pas de {px} m.',
  'Range bandwidth (MHz)': 'Largeur de bande en distance (MHz)',
  'GCOV pixel (m)': 'Pixel GCOV (m)',
  'our data': 'nos données',
  'How NASA makes it: the single-look radar image has samples about 5 m apart along the track and 6.25 m apart across it, in slant range. GCOV averages the samples that fall in each {px} m cell (multi-looking), corrects the brightness for terrain (gamma-0) and projects the result to UTM. Averaging also lowers speckle, the grain of radar images.':
    'Comment la NASA le produit : l’image radar mono-vue a des échantillons espacés d’environ 5 m le long de la trace et de 6.25 m en travers, en distance oblique. GCOV moyenne les échantillons qui tombent dans chaque cellule de {px} m (multi-vues), corrige la luminosité selon le relief (gamma-0) et projette le résultat en UTM. La moyenne réduit aussi le chatoiement, le grain des images radar.',
  'What we did: we read only our window from the frequency A grid, cut on {px} m boundaries, and never resampled the radar. One pixel in our numbers is one NASA pixel, in {crs}.':
    'Ce que nous avons fait : nous avons lu seulement notre fenêtre dans la grille de la fréquence A, découpée sur des limites de {px} m, sans jamais rééchantillonner le radar. Un pixel dans nos chiffres est un pixel de la NASA, en {crs}.',
  'The window is about {w} km by {h} km.': 'La fenêtre mesure environ {w} km sur {h} km.',
  'The optical photos (HLS, 30 m) were moved onto the radar grid, not the radar onto the photos.':
    'Les photos optiques (HLS, 30 m) ont été ramenées sur la grille radar, et non le radar sur les photos.',
  'Why we kept it: a finer grid would only repeat the same values, and a coarser one would merge small fields and the lake shore. Areas are counted in whole pixels: one pixel is {m2} m², {km2} km².':
    'Pourquoi nous l’avons gardé : une grille plus fine ne ferait que répéter les mêmes valeurs, et une grille plus grossière fondrait les petits champs et la rive du lac. Les surfaces sont comptées en pixels entiers : un pixel fait {m2} m², soit {km2} km².',
  'The speckle filter mixes {n} × {n} pixels, {w} m × {w} m, so details narrower than that blur.':
    'Le filtre de chatoiement mélange {n} × {n} pixels, {w} m × {w} m, donc les détails plus étroits deviennent flous.',
  'On the map, area images are at the full {px} m.': 'Sur la carte, les images des zones sont à la pleine résolution de {px} m.',
  'The whole-window images are shrunk to about {m} m per image pixel so the page loads fast; no number is measured on them.':
    'Les images de la fenêtre entière sont réduites à environ {m} m par pixel d’image pour que la page charge vite ; aucun chiffre n’est mesuré dessus.',
  'Source: ': 'Source : ',
  'ASF, NISAR GCOV product guide': 'ASF, guide du produit NISAR GCOV',
  'Interpretation texts: Claude (Anthropic), written from the measurements, checked by code':
    'Textes d’interprétation : Claude (Anthropic), rédigés à partir des mesures, vérifiés par du code',
  'Lee 5x5 in linear power, ENL 4.45': 'Lee 5x5 en puissance linéaire, ENL 4.45',
  'Per date: HH in dB after a 5x5 mean in linear power; Otsu threshold inside the area, then again within 1000 m of that first lake; keep the dark region touching the lake; a 100 m neck cut (erode 5 px, keep the largest piece, grow back inside the mask). Areas are counted on the radar grid (EPSG:32630).':
    'Par date : HH en dB après une moyenne 5x5 en puissance linéaire ; seuil d’Otsu dans la zone, puis de nouveau à moins de 1000 m de ce premier lac ; on garde la région sombre qui touche le lac ; une coupe de goulet de 100 m (érosion de 5 px, on garde le plus grand morceau, on le fait regrandir dans le masque). Les surfaces sont comptées sur la grille du radar (EPSG:32630).',
  'Open water: share of the radar class that the optical photo also shows as water': 'Eau libre : part de la classe radar que la photo optique montre aussi comme eau',
  'Open water: share of the optical water that the radar class covers': 'Eau libre : part de l’eau optique couverte par la classe radar',
}

const ar: Record<string, string> = {
  Explore: 'استكشاف',
  'Customized Service': 'خدمة حسب الطلب',
  'Method & Data': 'المنهج والبيانات',
  Sections: 'الأقسام',
  Language: 'اللغة',
  'Light mode': 'الوضع الفاتح',
  'Dark mode': 'الوضع الداكن',
  'NISAR L-band radar of the same place on two dates, what changed, and the measurements behind every sentence.':
    'رادار نيسار بنطاق L لنفس المكان في تاريخين، وما الذي تغيّر، والقياسات وراء كل جملة.',
  '{what}: not generated yet.': '{what}: لم تُنتج بعد.',
  'Text in English, as generated and checked.': 'النص بالإنجليزية كما أُنتج وتم التحقق منه.',

  'Swipe line between Date A (left) and Date B (right)': 'خط المقارنة بين التاريخ A (يسارًا) والتاريخ B (يمينًا)',
  '{n} % of the width shows Date A': '{n} % من العرض يُظهر التاريخ A',
  'Basemap offline: radar layers only.': 'الخريطة الأساسية غير متاحة: طبقات الرادار فقط.',
  'Loading radar image...': 'جارٍ تحميل صورة الرادار...',
  'A radar image could not be loaded.': 'تعذّر تحميل صورة رادار.',
  'Cursor {lat}, {lon}': 'المؤشر {lat}، {lon}',
  'Cursor: move over the map': 'المؤشر: مرّر فوق الخريطة',
  N: 'ش',
  S: 'ج',
  E: 'شر',
  W: 'غ',

  'Lake area': 'مساحة البحيرة',
  Date: 'التاريخ',
  'no value': 'لا قيمة',
  'no data': 'لا بيانات',
  'Flagged: {text}': 'تنبيه: {text}',
  ', flagged': '، عليه تنبيه',

  'Brighter means more signal came back. HV rises when the pulse bounces around inside a volume such as crops, shrubs or trees. Calm water and smooth bare soil stay dark.':
    'الأفتح يعني أن إشارة أكثر عادت. يرتفع HV عندما ترتد النبضة داخل حجم مثل المحاصيل أو الشجيرات أو الأشجار. يبقى الماء الهادئ والتربة العارية الملساء داكنين.',
  'Calm water reflects the pulse away from the radar and looks dark. Rough ground is brighter. Buildings facing the radar can be very bright, because walls and ground act as a corner reflector.':
    'يعكس الماء الهادئ النبضة بعيدًا عن الرادار فيبدو داكنًا. الأرض الخشنة أفتح. قد تبدو المباني المواجهة للرادار ساطعة جدًا لأن الجدران والأرض تعمل كعاكس زاوي.',
  'HV:HH compares the two. It is higher where vegetation volume dominates and lower on bare ground and buildings.':
    'تقارن نسبة HV:HH بين الاثنين. تكون أعلى حيث يغلب حجم النباتات، وأدنى على الأرض العارية والمباني.',
  'Each colour is one terrain type from our k-means model on the radar features. The names come from comparing the classes with the optical photo. Method & Data has the details.':
    'كل لون نوع من التضاريس من نموذج k-means الخاص بنا على خصائص الرادار. الأسماء مأخوذة من مقارنة الفئات بالصورة البصرية. التفاصيل في المنهج والبيانات.',
  'Pixels that got brighter or darker than the threshold between Date A and Date B. Crops, harvest, water level, soil moisture and rain can all do this, so read the map with the flags and the text.':
    'بكسلات صارت أفتح أو أدكن من العتبة بين التاريخ A والتاريخ B. قد يسبب ذلك المحاصيل أو الحصاد أو مستوى الماء أو رطوبة التربة أو المطر، فاقرأ الخريطة مع التنبيهات والنص.',
  'A natural-colour photo from an optical satellite, for comparison. Optical needs daylight and a clear sky. The radar sees through cloud and at night.':
    'صورة بألوان طبيعية من قمر صناعي بصري للمقارنة. يحتاج التصوير البصري إلى ضوء النهار وسماء صافية. أما الرادار فيرى عبر السحب وفي الليل.',
  'Area, dates and layer': 'المنطقة والتواريخ والطبقة',
  Interpretation: 'التفسير',
  Map: 'الخريطة',
  'Areas, dates and layers': 'المناطق والتواريخ والطبقات',
  'Radar layers: not generated yet.': 'طبقات الرادار: لم تُنتج بعد.',
  'Optical photo, nearest clear date': 'صورة بصرية، أقرب تاريخ صافٍ',
  'No clear optical photo near this date': 'لا توجد صورة بصرية صافية قرب هذا التاريخ',
  'No clear photo (radar {date})': 'لا صورة صافية (رادار {date})',
  'Photo {photo} (radar {radar})': 'صورة {photo} (رادار {radar})',
  ', sun glint': '، انعكاس الشمس',
  Area: 'المنطقة',
  'Whole radar window': 'نافذة الرادار كاملة',
  '{track}, {n} preset areas': '{track}، {n} مناطق محددة مسبقًا',
  'Two dates, A and B': 'تاريخان، A وB',
  'One date': 'تاريخ واحد',
  'No NISAR data {from} to {to}': 'لا بيانات من نيسار من {from} إلى {to}',
  'Date A, {name}': 'التاريخ A، {name}',
  'Date B, {name}': 'التاريخ B، {name}',
  'Flagged date': 'تاريخ عليه تنبيه',
  'Radar date': 'تاريخ الرادار',
  'Flagged: read with care.': 'عليه تنبيه: اقرأ بحذر.',
  Stop: 'إيقاف',
  Pause: 'توقف مؤقت',
  Resume: 'استئناف',
  'Play all {n} dates': 'تشغيل كل التواريخ ({n})',
  ' Next: {date}, after the gap with no NISAR data.': ' التالي: {date}، بعد الفترة الخالية من بيانات نيسار.',
  Dates: 'التواريخ',
  Layer: 'الطبقة',
  'Change in: ': 'التغير في: ',
  Opacity: 'العتامة',
  '{label} overview, {date}': '{label}، نظرة عامة، {date}',
  '{label}, {area}, {date}': '{label}، {area}، {date}',
  '{label}, overview': '{label}، نظرة عامة',
  '{label}, {area}': '{label}، {area}',
  '{label}: drawn per area, choose an area.': '{label}: تُرسم لكل منطقة، اختر منطقة.',
  '{label} ({pol}), {area}': '{label} ({pol})، {area}',
  '{what} (radar {date}).': '{what} (رادار {date}).',
  'Backscatter, same stretch for every date.': 'التشتت الخلفي، بنفس التمديد لكل التواريخ.',
  '{prefix}{photo}: {sensor}, {cloud} % cloud on its cloudiest tile, natural colour.':
    '{prefix}{photo}: {sensor}، {cloud} % سحب في أكثر بلاطاتها غيومًا، ألوان طبيعية.',
  'Sun glint on {date}: the sun was reflected off the water toward the satellite (glint angle {deg}°), so water looks pale blue instead of dark.':
    'انعكاس الشمس في {date}: انعكست الشمس على الماء نحو القمر الصناعي (زاوية الانعكاس {deg}°)، لذا يبدو الماء أزرق فاتحًا بدل أن يكون داكنًا.',
  '{sensor}, {date}, natural colour.': '{sensor}، {date}، ألوان طبيعية.',
  'Under it: {label}, {date}.': 'تحتها: {label}، {date}.',
  'Change from A {a} to B {b}, in {pol}.': 'التغير من A {a} إلى B {b}، في {pol}.',
  'Left of the line: A {a}. Right: B {b}.': 'يسار الخط: A {a}. يمينه: B {b}.',
  'Date: {date}.': 'التاريخ: {date}.',
  'The swipe compares two dates of {layers}.': 'تقارن أداة السحب بين تاريخين في {layers}.',
  'How to read this layer': 'كيف تُقرأ هذه الطبقة',
  '{n} days between A and B.': '{n} يومًا بين A وB.',
  'NASA gap: no NISAR data from {from} to {to}, so nothing between {before} and {after}.':
    'فجوة ناسا: لا بيانات من نيسار من {from} إلى {to}، لذا لا شيء بين {before} و{after}.',
  'No clear optical photo near {dates}: not available with this layer.': 'لا صورة بصرية صافية قرب {dates}: غير متاح مع هذه الطبقة.',
  '{i} of {n}: {when}{flagged}.': '{i} من {n}: {when}{flagged}.',
  'Play works with {layers}.': 'التشغيل يعمل مع {layers}.',
  HV: 'HV',
  HH: 'HH',
  'HV:HH ratio': 'نسبة HV:HH',
  'Terrain types': 'أنواع التضاريس',
  'Change A to B': 'التغير من A إلى B',
  'Optical photo, 22 Sep 2026': 'صورة بصرية، 22 شتنبر 2026',
  'Brighter (> +3 dB)': 'أفتح (> +3 dB)',
  'Darker (< -3 dB)': 'أدكن (< -3 dB)',

  'Days between': 'عدد الأيام بينهما',
  'Brighter in HV': 'أفتح في HV',
  'Darker in HV': 'أدكن في HV',
  'Brighter in HH': 'أفتح في HH',
  'Darker in HH': 'أدكن في HH',
  'Water change': 'تغير الماء',
  'Mean HV change': 'متوسط تغير HV',
  'Area of the circle': 'مساحة الدائرة',
  'With radar data': 'ببيانات رادار',
  Water: 'الماء',
  'Mean HH': 'متوسط HH',
  'Mean HV': 'متوسط HV',
  'Mean HV:HH': 'متوسط HV:HH',
  days: 'يومًا',
  'Terrain mix: {list}': 'توزيع التضاريس: {list}',
  Type: 'النوع',
  Reading: 'القراءة',
  'This date': 'هذا التاريخ',
  'A vs B': 'A مقابل B',
  'A, {date}': 'A، {date}',
  'B, {date}': 'B، {date}',
  'Loading...': 'جارٍ التحميل...',
  'Choose an area in the list or click a circle on the map to read what the radar shows there.':
    'اختر منطقة من القائمة أو انقر على دائرة في الخريطة لقراءة ما يُظهره الرادار هناك.',
  '{a} to {b}, {n} days': 'من {a} إلى {b}، {n} يومًا',
  'Comparison text': 'نص المقارنة',
  'Interpretation text': 'نص التفسير',
  'Caveats ({n})': 'تحفظات ({n})',
  'Key numbers': 'الأرقام الرئيسية',
  'Straight from the evidence file.': 'مأخوذة مباشرة من ملف الأدلة.',
  'Terrain mix': 'توزيع التضاريس',
  'Time series': 'السلسلة الزمنية',
  Evidence: 'الأدلة',
  'Lake area by date (km²)': 'مساحة البحيرة حسب التاريخ (كم²)',
  'Mean HV by terrain type (dB)': 'متوسط HV حسب نوع التضاريس (dB)',
  '{title}, {n} dates from {from} to {to}. The dashed stretch crosses the period with no data. Flagged dates are amber diamonds. Values are in the table below.':
    '{title}، {n} تواريخ من {from} إلى {to}. الجزء المتقطع يعبر الفترة الخالية من البيانات. التواريخ التي عليها تنبيه معيّنات كهرمانية. القيم في الجدول أدناه.',
  'Chart values': 'قيم الرسم البياني',
  'Show evidence': 'عرض الأدلة',
  'File: {path}': 'الملف: {path}',
  'SHA-256 of the evidence used for the text: {hash}': 'بصمة SHA-256 للأدلة المستعملة في النص: {hash}',
  'Number check: {result}, {n} numbers checked by {checker}.': 'تحقق الأرقام: {result}، {n} رقمًا تحقق منها {checker}.',
  passed: 'ناجح',
  failed: 'فاشل',
  'Interpretation written by Claude (Anthropic) from the measurements shown. Generated in advance for this prototype.':
    'تفسير كتبه Claude (Anthropic) انطلاقًا من القياسات المعروضة. أُنتج مسبقًا لهذا النموذج الأولي.',

  'Water agency': 'وكالة الماء',
  'Agriculture office': 'مكتب فلاحي',
  Insurance: 'تأمين',
  Research: 'بحث علمي',
  Other: 'أخرى',
  'Choose a sector': 'اختر قطاعًا',
  'Terrain interpretation': 'تفسير التضاريس',
  'Change comparison between dates': 'مقارنة التغيرات بين التواريخ',
  'Monitoring at each NISAR pass': 'رصد عند كل مرور لنيسار',
  'Monitoring at each NISAR pass (every {n} days)': 'رصد عند كل مرور لنيسار (كل {n} يومًا)',
  'Other (describe in the problem field)': 'أخرى (صِفها في خانة المشكلة)',
  'Service type (choose one or more)': 'نوع الخدمة (واحد أو أكثر)',
  'Report language': 'لغة التقرير',
  Consent: 'الموافقة',
  ' I agree that {team} uses these details only to answer this request and prepare the call.':
    ' أوافق على أن يستعمل {team} هذه المعلومات فقط للرد على هذا الطلب وتحضير المكالمة.',
  'Choose a day': 'اختر يومًا',
  'Choose a time': 'اختر وقتًا',
  'Choose a day first': 'اختر يومًا أولًا',
  '{start} to {end}': 'من {start} إلى {end}',
  'Prototype: requests are not stored or sent automatically.': 'نموذج أولي: لا تُحفظ الطلبات ولا تُرسل تلقائيًا.',
  'Who is asking': 'صاحب الطلب',
  Organisation: 'الهيئة',
  Sector: 'القطاع',
  'Contact name': 'اسم المسؤول عن التواصل',
  Email: 'البريد الإلكتروني',
  'Phone (optional)': 'الهاتف (اختياري)',
  'Country or region': 'البلد أو الجهة',
  'Area of interest': 'المنطقة المعنية',
  'Place name': 'اسم المكان',
  'Click the map to set the centre, or type its coordinates. Drag the pin to move it.':
    'انقر على الخريطة لتحديد المركز، أو اكتب إحداثياته. اسحب الدبوس لتحريكه.',
  'Centre latitude': 'خط عرض المركز',
  'Centre longitude': 'خط طول المركز',
  'Radius (km)': 'نصف القطر (كم)',
  'What you need': 'ما تحتاجه',
  'Time horizon, from': 'الفترة، من',
  to: 'إلى',
  'Problem description': 'وصف المشكلة',
  'What decision should the radar help with? What do you already know about the area?':
    'ما القرار الذي ينبغي أن يساعد فيه الرادار؟ ماذا تعرف مسبقًا عن المنطقة؟',
  'Discovery call ({n} minutes, {zone})': 'مكالمة تعارف ({n} دقيقة، {zone})',
  Day: 'اليوم',
  Time: 'الوقت',
  'Review request': 'مراجعة الطلب',
  'Request summary': 'ملخص الطلب',
  'A concept for a future service: an agency could ask for radar maps of its own area and dates, with a terrain interpretation, change comparisons between dates, and monitoring at each NISAR pass, every {n} days, anywhere NISAR covers.':
    'تصور لخدمة مستقبلية: يمكن لوكالة أن تطلب خرائط رادار لمنطقتها وتواريخها، مع تفسير للتضاريس، ومقارنات للتغير بين التواريخ، ورصد عند كل مرور لنيسار، كل {n} يومًا، في أي مكان يغطيه نيسار.',
  'It would be meant for water agencies, agriculture offices, insurers and researchers.':
    'وستكون موجهة لوكالات الماء والمكاتب الفلاحية وشركات التأمين والباحثين.',
  'This form shows what such a request would contain. You can fill it in and download it as a file.':
    'يُظهر هذا النموذج ما سيتضمنه طلب من هذا النوع. يمكنك ملؤه وتنزيله كملف.',
  'Send the request below and book a {n}-minute discovery call. On the call we go through your area, your dates and what the radar can and cannot show there.':
    'أرسل الطلب أدناه واحجز مكالمة تعارف مدتها {n} دقيقة. خلال المكالمة ندرس منطقتك وتواريخك وما يستطيع الرادار إظهاره هناك وما لا يستطيع.',
  'Nothing is sold or offered here. Explore shows the preset areas only; no custom analysis runs in this prototype.':
    'لا يُباع ولا يُعرض هنا أي شيء. يُظهر الاستكشاف المناطق المحددة مسبقًا فقط، ولا يُجرى أي تحليل حسب الطلب في هذا النموذج الأولي.',
  'Enter the organisation name.': 'أدخل اسم الهيئة.',
  'Choose a sector.': 'اختر قطاعًا.',
  'Enter a contact name.': 'أدخل اسم المسؤول عن التواصل.',
  'Enter an email address, for example name@agency.org.': 'أدخل بريدًا إلكترونيًا، مثل name@agency.org.',
  'Enter a country or region.': 'أدخل بلدًا أو جهة.',
  'Enter a place name.': 'أدخل اسم مكان.',
  'Click the map or type a latitude between -90 and 90.': 'انقر على الخريطة أو اكتب خط عرض بين -90 و90.',
  'Type a longitude between -180 and 180.': 'اكتب خط طول بين -180 و180.',
  'Enter a radius in km, greater than 0.': 'أدخل نصف قطر بالكيلومتر أكبر من 0.',
  'Choose a start date.': 'اختر تاريخ البداية.',
  'Choose an end date.': 'اختر تاريخ النهاية.',
  'The end date must be after the start date.': 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية.',
  'Choose at least one service type.': 'اختر نوع خدمة واحدًا على الأقل.',
  'Describe the problem in a few sentences.': 'صِف المشكلة في بضع جمل.',
  'Choose a day for the call.': 'اختر يومًا للمكالمة.',
  'Choose a time for the call.': 'اختر وقتًا للمكالمة.',
  'Tick the box to agree.': 'ضع علامة في الخانة للموافقة.',
  Phone: 'الهاتف',
  'not given': 'غير مذكور',
  'Centre (lat, lon)': 'المركز (عرض، طول)',
  Radius: 'نصف القطر',
  'Time horizon': 'الفترة',
  Services: 'الخدمات',
  Problem: 'المشكلة',
  'Discovery call': 'مكالمة تعارف',
  given: 'ممنوحة',
  'Download request (JSON)': 'تنزيل الطلب (JSON)',
  'Send by email': 'إرسال بالبريد الإلكتروني',
  'Edit request': 'تعديل الطلب',
  'Request ready to send': 'الطلب جاهز للإرسال',
  'Check the details. Nothing has left this page yet. Download the request or open it in your email program.':
    'تحقق من المعلومات. لم يغادر شيء هذه الصفحة بعد. نزّل الطلب أو افتحه في برنامج البريد.',
  'Check the details. Nothing has left this page yet. Download the request as a file.':
    'تحقق من المعلومات. لم يغادر شيء هذه الصفحة بعد. نزّل الطلب كملف.',
  'Check: ': 'تحقق: ',

  Measure: 'القياس',
  code: 'برمجة',
  Claude: 'Claude',
  app: 'التطبيق',
  'Clean the radar, sort terrain into classes with our k-means model, map water, measure change, compute statistics.':
    'تنقية الرادار، وتصنيف التضاريس بنموذج k-means الخاص بنا، ورسم خريطة الماء، وقياس التغير، وحساب الإحصاءات.',
  'Write one JSON file per area and date, and per area and date pair, with every number a text may use.':
    'كتابة ملف JSON لكل منطقة وتاريخ، ولكل منطقة وزوج تواريخ، يضم كل رقم قد يستعمله النص.',
  Interpret: 'التفسير',
  'Claude writes each text from its evidence file only, with fixed templates. It sees statistics, never images.':
    'يكتب Claude كل نص انطلاقًا من ملف أدلته وحده، بقوالب ثابتة. يرى الإحصاءات فقط، ولا يرى الصور أبدًا.',
  Check: 'التحقق',
  'A script pulls every number and date out of each text and rejects the text if one is not in its evidence.':
    'يستخرج برنامج كل رقم وتاريخ من كل نص ويرفض النص إذا لم يكن أحدها في أدلته.',
  Display: 'العرض',
  'The text, its key numbers, the label and the full evidence are shown together.':
    'يُعرض النص وأرقامه الرئيسية والإشارة والأدلة الكاملة معًا.',
  'NISAR radar, HH and HV': 'رادار نيسار، HH وHV',
  "NISAR carries an L-band radar with a wavelength of {cm} cm. It sends its own microwave pulses, so it sees the ground through cloud and at night. We use {sensor} data, track {track}, {px} m pixels, one pass every {days} days. Areas are measured in the radar's own grid, {crs}.":
    'يحمل نيسار رادارًا بنطاق L بطول موجة {cm} سم. يرسل نبضاته الميكروية الخاصة، فيرى الأرض عبر السحب وفي الليل. نستعمل بيانات {sensor}، المسار {track}، بكسلات {px} م، ومرورًا كل {days} يومًا. تُقاس المساحات في شبكة الرادار نفسها، {crs}.',
  'Sensor details': 'تفاصيل المستشعر',
  'HH: sent horizontal, received horizontal. Calm water reflects the pulse away from the radar and looks dark. Rough ground and buildings send more back.':
    'HH: إرسال أفقي واستقبال أفقي. يعكس الماء الهادئ النبضة بعيدًا عن الرادار فيبدو داكنًا. الأرض الخشنة والمباني تُرجع أكثر.',
  'HV: sent horizontal, received vertical. The signal changes polarisation when it bounces around inside a volume such as a crop canopy or shrubs, so HV rises with vegetation and stays low on water and smooth bare soil.':
    'HV: إرسال أفقي واستقبال عمودي. تتغير استقطابية الإشارة حين ترتد داخل حجم مثل غطاء المحاصيل أو الشجيرات، فيرتفع HV مع النباتات ويبقى منخفضًا على الماء والتربة العارية الملساء.',
  'HV:HH is the ratio of the two. All values are backscatter in dB, averaged in linear power before converting to dB.':
    'HV:HH هي النسبة بين الاثنين. كل القيم تشتت خلفي بالديسيبل، يُحسب متوسطها بالقدرة الخطية قبل التحويل إلى dB.',
  'Dates used ({n}): {dates}. NISAR has no data from {from} to {to}.': 'التواريخ المستعملة ({n}): {dates}. لا بيانات لنيسار من {from} إلى {to}.',
  'Date list': 'قائمة التواريخ',
  'Speckle filter: {filter}. Pixels used in every comparison: valid on all dates, {pct} % of the window.':
    'مرشح الضجيج المرقّط: {filter}. البكسلات المستعملة في كل مقارنة: صالحة في كل التواريخ، {pct} % من النافذة.',
  'Speckle and valid pixels': 'الضجيج المرقّط والبكسلات الصالحة',
  'Terrain types, our model': 'أنواع التضاريس، نموذجنا',
  'k-means clustering with these features: {features}. Tested k = {tested}; chosen k = {k}. Each cluster was named by comparing it with the optical photo.':
    'تجميع k-means بهذه الخصائص: {features}. قيم k المجرّبة = {tested}؛ k المختار = {k}. سُمّيت كل مجموعة بمقارنتها بالصورة البصرية.',
  'Agreement check': 'فحص التطابق',
  'Terrain model numbers': 'أرقام نموذج التضاريس',
  Class: 'الفئة',
  'Why it looks this way in HH and HV': 'لماذا تبدو هكذا في HH وHV',
  'Terrain classes': 'فئات التضاريس',
  'Mapped from {pol} only.': 'رُسمت من {pol} فقط.',
  'A date is flagged when the lake area changes by more than {pct} % from the previous date, or its threshold moves by more than {db} dB. These limits are our method choice.':
    'يُوضع تنبيه على تاريخ حين تتغير مساحة البحيرة بأكثر من {pct} % عن التاريخ السابق، أو تتحرك عتبتها بأكثر من {db} dB. هذه الحدود اختيار منهجي منا.',
  'Water method numbers': 'أرقام منهج الماء',
  'Change between two dates': 'التغير بين تاريخين',
  'Per-pixel difference in dB on the filtered radar. Brighter: more than +{up} dB. Darker: less than {down} dB. These thresholds are our method choice.':
    'الفرق لكل بكسل بالديسيبل على الرادار المنقّى. أفتح: أكثر من +{up} dB. أدكن: أقل من {down} dB. هذه العتبات اختيار منهجي منا.',
  'Stable-target check: median backscatter over the built-up class on each date. Buildings should change little, so a shift there points to weather or processing rather than land change.':
    'فحص الأهداف الثابتة: الوسيط للتشتت الخلفي على فئة المباني في كل تاريخ. المباني لا تتغير إلا قليلًا، فأي انزياح فيها يشير إلى الطقس أو المعالجة لا إلى تغير الأرض.',
  'HH dB': 'HH dB',
  'HV dB': 'HV dB',
  'Change method numbers': 'أرقام منهج التغير',
  'no date': 'لا تاريخ',
  'Caveats and flags': 'التحفظات والتنبيهات',
  Caveats: 'التحفظات',
  Flags: 'التنبيهات',
  'About the texts': 'عن النصوص',
  'The interpretation and comparison texts are written by Claude (Anthropic) from the evidence file of each area and date. The model receives numbers only, never the radar images. Possible causes are labelled as such, and flagged dates are described with lower confidence.':
    'يكتب Claude (Anthropic) نصوص التفسير والمقارنة انطلاقًا من ملف أدلة كل منطقة وتاريخ. لا يتلقى النموذج إلا الأرقام، ولا يرى صور الرادار أبدًا. تُقدَّم الأسباب المحتملة على أنها كذلك، وتوصف التواريخ التي عليها تنبيه بثقة أقل.',
  'In this prototype the texts are generated in advance, because live calls need a paid API key and a server. The templates are the same ones a live service would send to the Claude API, for any area.':
    'في هذا النموذج الأولي أُنتجت النصوص مسبقًا، لأن الطلبات المباشرة تحتاج مفتاح API مدفوعًا وخادمًا. القوالب هي نفسها التي ستُرسل إلى واجهة Claude في خدمة مباشرة، لأي منطقة.',
  'A script rejects any text that contains a number or date missing from its evidence file. It does not check that a sentence uses a number correctly, so the evidence and the key numbers are shown next to every text.':
    'يرفض برنامج نصي كل نص يحتوي على رقم أو تاريخ غير موجود في ملف أدلته. لكنه لا يتحقق من أن الجملة تستعمل الرقم بشكل صحيح، لذلك تُعرض الأدلة والأرقام الرئيسية بجانب كل نص.',
  'The texts are in English. A translated text would need its own check against the evidence.':
    'النصوص بالإنجليزية. أي نص مترجم سيحتاج إلى تحقق خاص به مقابل الأدلة.',
  'Texts in this build: {n}.': 'عدد النصوص في هذه النسخة: {n}.',
  Texts: 'النصوص',
  'Data and credits': 'البيانات والمصادر',
  'Data credits': 'مصادر البيانات',
  Team: 'الفريق',
  'How every map, number and sentence in Explore is made, and where it can be wrong.':
    'كيف تُصنع كل خريطة ورقم وجملة في الاستكشاف، وأين يمكن أن تخطئ.',
  'From radar to text in five steps': 'من الرادار إلى النص في خمس خطوات',
  'Translated by Claude from the checked English text. Its numbers match the English.':
    'ترجمه Claude من النص الإنجليزي المتحقق منه. أرقامه مطابقة لأرقام النص الإنجليزي.',
  'The texts were written in English. The French and Arabic versions are translations whose numbers are checked against the English.':
    'كُتبت النصوص بالإنجليزية. النسختان الفرنسية والعربية ترجمتان تم التحقق من أرقامهما مقابل النص الإنجليزي.',

  'NASA Space Apps Challenge 2026, Beni Mellal, challenge "Dancing with the SARs"': 'تحدي ناسا لتطبيقات الفضاء 2026، بني ملال، تحدي «Dancing with the SARs»',
  'Bin El Ouidane reservoir': 'بحيرة سد بين الويدان',
  'Tadla irrigated plain, Beni Moussa side': 'سهل تادلة المسقي، جهة بني موسى',
  'Beni Mellal city and foothills': 'مدينة بني ملال وسفوحها',
  'Beni Mellal-Khenifra, Morocco': 'جهة بني ملال-خنيفرة، المغرب',
  'The reservoir on the El Abid river and its shore.': 'حقينة السد على وادي العبيد وضفافها.',
  'Irrigated fields of the Tadla plain, where the photo shows green fields.': 'حقول سهل تادلة المسقية، حيث تُظهر الصورة حقولًا خضراء.',
  'Beni Mellal city and the hills next to it.': 'مدينة بني ملال والتلال المجاورة لها.',
  'Open water': 'مياه مكشوفة',
  'Built-up': 'مناطق مبنية',
  'Trees, shrub and rugged slopes': 'أشجار وشجيرات ومنحدرات وعرة',
  'Changing fields': 'حقول متغيرة',
  'Rough dry ground and fields': 'أرض جافة خشنة وحقول',
  'Smooth bare ground and dry fields': 'أرض عارية ملساء وحقول جافة',
  'Calm water reflects the pulse away from the radar, so the lake is among the darkest surfaces in HH and HV. Wind can roughen the surface and brighten it a little. At L-band smooth dry fields can be nearly as dark, so water is mapped from the connected lake shape, not from brightness alone.':
    'يعكس الماء الهادئ النبضة بعيدًا عن الرادار، لذا تكون البحيرة من أدكن الأسطح في HH وHV. قد تجعّد الرياح السطح فيصبح أفتح قليلًا. في نطاق L قد تكون الحقول الجافة الملساء داكنة بالقدر نفسه تقريبًا، لذا يُرسم الماء انطلاقًا من شكل البحيرة المتصل لا من السطوع وحده.',
  'Walls and the ground beside them act as corner reflectors that send the pulse straight back (double bounce), so HH is very bright. HV stays much lower, which gives the lowest HV:HH ratio of all types. Isolated farm buildings show up as bright points on the plain.':
    'تعمل الجدران والأرض المحاذية لها كعواكس زاوية تُرجع النبضة مباشرة (الارتداد المزدوج)، لذا يكون HH ساطعًا جدًا. يبقى HV أدنى بكثير، مما يعطي أدنى نسبة HV:HH بين كل الأنواع. تظهر المباني الفلاحية المتفرقة كنقاط ساطعة في السهل.',
  'Leaves and branches scatter the pulse in many directions (volume scattering), which raises HV the most of all land types. Slopes facing the radar look bright in both channels. Tall crops and tree plots on the plain can fall in this type too.':
    'تبعثر الأوراق والأغصان النبضة في اتجاهات كثيرة (تشتت حجمي)، مما يرفع HV أكثر من كل أنواع الأراضي الأخرى. تبدو المنحدرات المواجهة للرادار ساطعة في القناتين. قد تدخل المحاصيل الطويلة وقطع الأشجار في السهل ضمن هذا النوع أيضًا.',
  'HV changed strongly between June and September, as it does when a crop grows (more volume scattering) or is harvested or ploughed (less). These are the fields with the most activity in the season. Which crop it is cannot be told from the radar alone.':
    'تغيّر HV بقوة بين يونيو وشتنبر، كما يحدث عندما ينمو محصول (تشتت حجمي أكبر) أو يُحصد أو يُحرث (أقل). هذه هي الحقول الأكثر نشاطًا في الموسم. لا يمكن معرفة نوع المحصول من الرادار وحده.',
  'Rough soil, stones and sparse plants send part of the pulse back (rough surface scattering), so HH and HV are medium. Little change from June to September. Found on dry fields of the plain and on stony ridges.':
    'تُرجع التربة الخشنة والحجارة والنباتات المتناثرة جزءًا من النبضة (تشتت سطحي خشن)، لذا يكون HH وHV متوسطين. تغيّر قليل من يونيو إلى شتنبر. يوجد في الحقول الجافة بالسهل وعلى التلال الحجرية.',
  'Smooth dry soil reflects most of the pulse away, so HH and HV are low, close to calm water. Little change from June to September, which fits fallow or harvested land. The optical photo shows most of this type as bright bare soil.':
    'تعكس التربة الجافة الملساء معظم النبضة بعيدًا، لذا يكون HH وHV منخفضين، قريبين من الماء الهادئ. تغيّر قليل من يونيو إلى شتنبر، وهو ما يناسب الأراضي البور أو المحصودة. تُظهر الصورة البصرية معظم هذا النوع كتربة عارية فاتحة.',
  'Lake mask area changes more than 15% from the previous date': 'تتغير مساحة قناع البحيرة بأكثر من 15% عن التاريخ السابق',
  'Lake water threshold moves more than 1.0 dB from the previous date': 'تتحرك عتبة ماء البحيرة بأكثر من 1.0 dB عن التاريخ السابق',
  'Backscatter over built-up land shifts more than 0.5 dB from its June-September median: possible processing offset or widespread wet conditions':
    'ينزاح التشتت الخلفي فوق المناطق المبنية بأكثر من 0.5 dB عن وسيطه بين يونيو وشتنبر: احتمال انزياح في المعالجة أو ظروف رطبة واسعة',
  'What the radar shows here': 'ما يُظهره الرادار هنا',
  'Terrain types and what they mean': 'أنواع التضاريس ودلالتها',
  'Data quality notes': 'ملاحظات حول جودة البيانات',
  'What changed': 'ما الذي تغيّر',
  'Where, by terrain type': 'أين، حسب نوع التضاريس',
  'Possible causes': 'أسباب محتملة',
  Limits: 'الحدود',
  'What an agency could do next': 'ما يمكن لوكالة أن تفعله بعد ذلك',
  'Area with data': 'المساحة ذات البيانات',
  'Lake outline on dry land': 'محيط البحيرة على أرض جافة',
  'Lake change': 'تغير البحيرة',
  'Mean HH change': 'متوسط تغير HH',
  'NASA has no NISAR data for 27 Jul to 10 Aug 2026, so this series has nothing between 16 Jul and 21 Aug.':
    'لا تتوفر لدى ناسا بيانات نيسار من 27 يوليوز إلى 10 غشت 2026، لذا لا شيء في هذه السلسلة بين 16 يوليوز و21 غشت.',
  'One track only (116 asc frame 018); every date sees the ground from the same side, so slopes facing away from the radar can fall in radar shadow.':
    'مسار واحد فقط (116 asc frame 018)؛ كل تاريخ يرى الأرض من الجهة نفسها، لذا قد تقع المنحدرات المعاكسة للرادار في ظل الرادار.',
  'Mean HH over the whole window rises from -8.43 dB on 2026-09-26 to -7.5 dB on 2026-10-08 and -6.92 dB on 2026-10-20. The cause is not known (rain or processing); these dates are flagged and not read as land change.':
    'يرتفع متوسط HH على كامل النافذة من -8.43 dB في 2026-09-26 إلى -7.5 dB في 2026-10-08 و-6.92 dB في 2026-10-20. السبب غير معروف (مطر أو معالجة)؛ لذا وُضع تنبيه على هذه التواريخ ولا تُقرأ كتغير في الأرض.',
  'bin-el-ouidane: 8.2 to 17.1% of the radar lake outline falls on land in the 22 Sep optical photo (likely radar shadow on slopes); lake areas are approximate.':
    'bin-el-ouidane: من 8.2 إلى 17.1% من محيط البحيرة الراداري يقع على اليابسة في الصورة البصرية ليوم 22 شتنبر (غالبًا ظل الرادار على المنحدرات)؛ مساحات البحيرة تقريبية.',
  'Dates flagged for a backscatter shift over built-up land: 2026-10-08, 2026-10-20.':
    'تواريخ عليها تنبيه بسبب انزياح التشتت الخلفي فوق المناطق المبنية: 2026-10-08، 2026-10-20.',
  'Check with one date outside the series, 2026-11-01 (processing P05036, the series is P05023): mean HH over the window is -8.5 dB and built-up HH is -0.11 dB from its June-September median, back at the summer level. With a different processing code, this cannot tell a surface that dried from a processing change.':
    'تحقق بتاريخ خارج السلسلة، 2026-11-01 (المعالجة P05036، والسلسلة P05023): متوسط HH على النافذة -8.5 dB، وHH المناطق المبنية يبعد -0.11 dB عن وسيطه بين يونيو وشتنبر، أي عاد إلى مستوى الصيف. ومع اختلاف رمز المعالجة، لا يمكن بهذا التمييز بين سطح جفّ وتغيّر في المعالجة.',
  'NISAR L2 GCOV: NASA ASF DAAC (track 116 ascending frame 018)': 'NISAR L2 GCOV: NASA ASF DAAC (المسار 116 الصاعد، الإطار 018)',
  'HLS S30 v2.0 natural colour: NASA LP DAAC (22 Sep 2026)': 'HLS S30 v2.0 بألوان طبيعية: NASA LP DAAC (22 شتنبر 2026)',
  'Basemap: OpenFreeMap (map data OpenStreetMap contributors)': 'الخريطة الأساسية: OpenFreeMap (بيانات الخريطة من مساهمي OpenStreetMap)',
  'Optical photos near the radar dates: {sensors}, from NASA LP DAAC.': 'الصور البصرية القريبة من تواريخ الرادار: {sensors}، من NASA LP DAAC.',
  'Pixel spacing by bandwidth: ASF, NISAR GCOV product guide, {url}': 'خطوة البكسل حسب عرض النطاق: ASF، دليل منتج NISAR GCOV، {url}',
  Start: 'البداية',
  'What would you like to do?': 'ماذا تريد أن تفعل؟',
  'For anyone curious': 'لكل فضولي',
  'Look at the preset maps': 'تصفّح الخرائط الجاهزة',
  '{area}, HV radar, {date}': '{area}، رادار HV، {date}',
  '{area}, HV radar on two dates, same stretch on both.': '{area}، رادار HV في تاريخين، بنفس التمديد في الاثنين.',
  'Swipe between {n} NISAR radar dates, {from} to {to}, over {areas}. Every map comes with a short reading, the numbers behind it and its flags.':
    'مرّر بين {n} تواريخ رادار نيسار، من {from} إلى {to}، فوق {areas}. كل خريطة ترافقها قراءة قصيرة والأرقام التي بُنيت عليها وتنبيهاتها.',
  'Explore the maps': 'استكشف الخرائط',
  'For agencies, companies and researchers': 'للوكالات والشركات والباحثين',
  'Ask for a custom interpretation': 'اطلب تفسيرًا مخصصًا',
  'A concept for a future service: describe your own area, your dates and the decision the radar should help with.':
    'فكرة لخدمة مستقبلية: صِف منطقتك وتواريخك والقرار الذي ينبغي أن يساعد فيه الرادار.',
  'Area of interest: a centre on the map and a radius': 'منطقة الاهتمام: مركز على الخريطة ونصف قطر',
  'Time horizon and service type': 'الأفق الزمني ونوع الخدمة',
  'Report language: English, French or Arabic': 'لغة التقرير: الإنجليزية أو الفرنسية أو العربية',
  'In this prototype the request is prepared as a file. Nothing is sent, sold or stored.':
    'في هذا النموذج الأولي يُجهَّز الطلب كملف. لا يُرسل شيء ولا يُباع ولا يُخزَّن.',
  'Prepare a request': 'جهّز طلبًا',
  '{sensor}, {wavelength} cm wavelength, {px} m pixels, one pass every {days} days.':
    '{sensor}، طول الموجة {wavelength} سم، بكسلات {px} م، مرور كل {days} يومًا.',
  'Why {px} m pixels?': 'لماذا بكسلات {px} م؟',
  'How every number is made': 'كيف يُحسب كل رقم',
  'Radar pixel: {px} m × {px} m.': 'بكسل الرادار: {px} م × {px} م.',
  'Area image: 1 image pixel = 1 radar pixel.': 'صورة المنطقة: بكسل صورة واحد = بكسل رادار واحد.',
  'Area image: 1 image pixel ≈ {m} m.': 'صورة المنطقة: بكسل الصورة ≈ {m} م.',
  'Whole window: 1 image pixel ≈ {m} m, shrunk to load fast.': 'النافذة كاملة: بكسل الصورة ≈ {m} م، مصغّرة لتُحمَّل بسرعة.',
  'Optical photos are 30 m, moved onto the radar grid.': 'الصور البصرية بدقة 30 م، نُقلت إلى شبكة الرادار.',
  'Why {px} m?': 'لماذا {px} م؟',
  'Pixel size: why {px} m': 'حجم البكسل: لماذا {px} م',
  'We did not pick {px} m: it is the grid NASA delivers for our data. NISAR recorded track {track} in its 20 MHz mode, written 2005 in every file name (20 MHz on the main band, frequency A, which we use; 5 MHz on the second band). For a 20 MHz acquisition the GCOV product is posted at {px} m.':
    'لم نختر {px} م: إنها الشبكة التي تسلّمها ناسا لبياناتنا. سجّل نيسار المسار {track} في نمط 20 MHz، المكتوب 2005 في اسم كل ملف (20 MHz على النطاق الرئيسي، التردد A، الذي نستعمله؛ و5 MHz على النطاق الثاني). لاقتناء بعرض 20 MHz يُنشر منتج GCOV بخطوة {px} م.',
  'Range bandwidth (MHz)': 'عرض النطاق في المدى (MHz)',
  'GCOV pixel (m)': 'بكسل GCOV (م)',
  'our data': 'بياناتنا',
  'How NASA makes it: the single-look radar image has samples about 5 m apart along the track and 6.25 m apart across it, in slant range. GCOV averages the samples that fall in each {px} m cell (multi-looking), corrects the brightness for terrain (gamma-0) and projects the result to UTM. Averaging also lowers speckle, the grain of radar images.':
    'كيف تصنعه ناسا: في صورة الرادار أحادية النظرة تتباعد العينات نحو 5 م على طول المسار و6.25 م عرضيًا، في المدى المائل. يحسب GCOV متوسط العينات الواقعة في كل خلية من {px} م (تعدد النظرات)، ويصحّح السطوع حسب التضاريس (gamma-0)، ويُسقط النتيجة على UTM. كما يقلّل المتوسط من الضجيج المرقّط، أي حُبيبات صور الرادار.',
  'What we did: we read only our window from the frequency A grid, cut on {px} m boundaries, and never resampled the radar. One pixel in our numbers is one NASA pixel, in {crs}.':
    'ما فعلناه: قرأنا نافذتنا فقط من شبكة التردد A، مقطوعة على حدود {px} م، ولم نُعِد أخذ عينات الرادار أبدًا. البكسل في أرقامنا هو بكسل ناسا نفسه، في {crs}.',
  'The window is about {w} km by {h} km.': 'تبلغ النافذة نحو {w} كم في {h} كم.',
  'The optical photos (HLS, 30 m) were moved onto the radar grid, not the radar onto the photos.':
    'نُقلت الصور البصرية (HLS، 30 م) إلى شبكة الرادار، لا الرادار إلى الصور.',
  'Why we kept it: a finer grid would only repeat the same values, and a coarser one would merge small fields and the lake shore. Areas are counted in whole pixels: one pixel is {m2} m², {km2} km².':
    'لماذا أبقيناه: شبكة أدق لن تفعل سوى تكرار القيم نفسها، وشبكة أخشن ستدمج الحقول الصغيرة وضفة البحيرة. تُحسب المساحات ببكسلات كاملة: البكسل الواحد {m2} م²، أي {km2} كم².',
  'The speckle filter mixes {n} × {n} pixels, {w} m × {w} m, so details narrower than that blur.':
    'يمزج مرشّح الضجيج المرقّط {n} × {n} بكسلات، أي {w} م × {w} م، فتصبح التفاصيل الأضيق من ذلك ضبابية.',
  'On the map, area images are at the full {px} m.': 'على الخريطة، صور المناطق بالدقة الكاملة {px} م.',
  'The whole-window images are shrunk to about {m} m per image pixel so the page loads fast; no number is measured on them.':
    'صور النافذة الكاملة مصغّرة إلى نحو {m} م لكل بكسل صورة كي تُحمَّل الصفحة بسرعة؛ لا يُقاس عليها أي رقم.',
  'Source: ': 'المصدر: ',
  'ASF, NISAR GCOV product guide': 'ASF، دليل منتج NISAR GCOV',
  'Interpretation texts: Claude (Anthropic), written from the measurements, checked by code':
    'نصوص التفسير: Claude (Anthropic)، مكتوبة انطلاقًا من القياسات ومتحقق منها برمجيًا',
  'Lee 5x5 in linear power, ENL 4.45': 'Lee 5x5 بالقدرة الخطية، ENL 4.45',
  'Per date: HH in dB after a 5x5 mean in linear power; Otsu threshold inside the area, then again within 1000 m of that first lake; keep the dark region touching the lake; a 100 m neck cut (erode 5 px, keep the largest piece, grow back inside the mask). Areas are counted on the radar grid (EPSG:32630).':
    'لكل تاريخ: HH بالديسيبل بعد متوسط 5x5 بالقدرة الخطية؛ عتبة أوتسو داخل المنطقة، ثم مرة أخرى ضمن 1000 م من تلك البحيرة الأولى؛ تُحفظ المنطقة الداكنة الملامسة للبحيرة؛ قطع عنق بعرض 100 م (تآكل 5 بكسل، الاحتفاظ بأكبر جزء، ثم إعادة تنميته داخل القناع). تُحسب المساحات على شبكة الرادار (EPSG:32630).',
  'Open water: share of the radar class that the optical photo also shows as water': 'مياه مكشوفة: حصة الفئة الرادارية التي تُظهرها الصورة البصرية أيضًا كماء',
  'Open water: share of the optical water that the radar class covers': 'مياه مكشوفة: حصة الماء البصري التي تغطيها الفئة الرادارية',
}

export const dictionaries: Record<Exclude<Lang, 'en'>, Record<string, string>> = { fr, ar }

const englishMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const dayMonth = (day: string, month: string) => `${day} ${months[englishMonths.indexOf(month)]}`
const isoDay = (iso: string) => `${Number(iso.slice(8, 10))} ${months[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`

type Pattern = [RegExp, (match: RegExpMatchArray) => string]

const patterns: Record<Exclude<Lang, 'en'>, Pattern[]> = {
  fr: [
    [/^Lake area, (\d{1,2}) (\w{3})( \(flagged\))?$/, (m) => `Surface du lac, ${dayMonth(m[1], m[2])}${m[3] ? ' (signalée)' : ''}`],
    [
      /^Lake areas are approximate: ([\d.]+)% \((\S+)\) and ([\d.]+)% \((\S+)\) of the radar lake outline falls on land in the (\S+) optical photo\.$/,
      (m) => `Surfaces du lac approximatives : ${m[1]} % (${isoDay(m[2])}) et ${m[3]} % (${isoDay(m[4])}) du contour radar du lac tombent sur la terre ferme dans la photo optique du ${isoDay(m[5])}.`,
    ],
    [
      /^NASA has no NISAR data from (\S+) to (\S+), so nothing between (\S+) and (\S+) is seen\.$/,
      (m) => `La NASA n’a pas de données NISAR du ${isoDay(m[1])} au ${isoDay(m[2])} : rien n’est donc vu entre le ${isoDay(m[3])} et le ${isoDay(m[4])}.`,
    ],
    [
      /^Brighter and darker count pixels inside the circle whose backscatter changed by more than \+([\d.]+) dB or less than (-[\d.]+) dB between the two dates, on the speckle-filtered images\.$/,
      (m) => `« Plus clair » et « plus sombre » comptent les pixels du cercle dont la rétrodiffusion a changé de plus de +${m[1]} dB ou de moins de ${m[2]} dB entre les deux dates, sur les images filtrées du chatoiement.`,
    ],
    [/^(\d{4}-\d{2}-\d{2}): (.+)\.$/, (m) => `${isoDay(m[1])} : ${t(m[2])}.`],
    [/^Green land on the optical photo: share that the radar puts in (.+)$/, (m) => `Terres vertes sur la photo optique : part que le radar classe en ${t(m[1])}`],
    [/^(.+): share that is green on the optical photo$/, (m) => `${t(m[1])} : part verte sur la photo optique`],
  ],
  ar: [
    [/^Lake area, (\d{1,2}) (\w{3})( \(flagged\))?$/, (m) => `مساحة البحيرة، ${dayMonth(m[1], m[2])}${m[3] ? ' (عليه تنبيه)' : ''}`],
    [
      /^Lake areas are approximate: ([\d.]+)% \((\S+)\) and ([\d.]+)% \((\S+)\) of the radar lake outline falls on land in the (\S+) optical photo\.$/,
      (m) => `مساحات البحيرة تقريبية: ${m[1]}% (${isoDay(m[2])}) و${m[3]}% (${isoDay(m[4])}) من محيط البحيرة الراداري يقع على اليابسة في الصورة البصرية ليوم ${isoDay(m[5])}.`,
    ],
    [
      /^NASA has no NISAR data from (\S+) to (\S+), so nothing between (\S+) and (\S+) is seen\.$/,
      (m) => `لا تتوفر لدى ناسا بيانات نيسار من ${isoDay(m[1])} إلى ${isoDay(m[2])}، لذا لا يُرى شيء بين ${isoDay(m[3])} و${isoDay(m[4])}.`,
    ],
    [
      /^Brighter and darker count pixels inside the circle whose backscatter changed by more than \+([\d.]+) dB or less than (-[\d.]+) dB between the two dates, on the speckle-filtered images\.$/,
      (m) => `«أفتح» و«أدكن» يعدّان بكسلات الدائرة التي تغيّر تشتتها الخلفي بأكثر من +${m[1]} dB أو أقل من ${m[2]} dB بين التاريخين، على الصور المنقاة من الضجيج المرقّط.`,
    ],
    [/^(\d{4}-\d{2}-\d{2}): (.+)\.$/, (m) => `${isoDay(m[1])}: ${t(m[2])}.`],
    [/^Green land on the optical photo: share that the radar puts in (.+)$/, (m) => `الأرض الخضراء في الصورة البصرية: الحصة التي يضعها الرادار في ${t(m[1])}`],
    [/^(.+): share that is green on the optical photo$/, (m) => `${t(m[1])}: الحصة الخضراء في الصورة البصرية`],
  ],
}

function translate(text: string): string {
  if (lang === 'en') return text
  const exact = dictionaries[lang][text]
  if (exact !== undefined) return exact
  for (const [pattern, build] of patterns[lang]) {
    const match = text.match(pattern)
    if (match) return build(match)
  }
  return text
}

export function t(text: string, values: Record<string, string | number> = {}): string {
  return translate(text).replace(/\{(\w+)\}/g, (whole, key: string) => (key in values ? String(values[key]) : whole))
}

export function untranslated(text: string): boolean {
  return lang !== 'en' && translate(text) === text
}
