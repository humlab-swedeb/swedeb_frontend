// This is just an example,
// so you can safely delete all default props below

export default {
  failed: "Misslyckades",
  success: "Lyckades",

  // MetaDataFilter component
  metaDataFilter: "Filtrera på metadata",
  metaDataFilterMini: "Metadatafilter",
  selectedMetaDataTitle: "Valda filtreringsalternativ:",

  // YearRange component (used in MetaDataFilter)
  year: "År",
  yearRangeMin: "1920",
  yearRangeMax: "2022",

  office: "Office type",
  subOffice: "Sub office type",
  party: "Parti",
  gender: "Kön",
  speakers: "Talare",

  toolsFilterTitle: "Verktygsspecifika Filter",
  "/tools/wordtrends": "Ordtrender",
  "/tools/kwic": "Key word in context",
  "/tools/speeches": "Anföranden",
  "/tools/ngram": "N-grams",

  speechesNoTools: "Filtrera ovan med hjälp av 'Filtrera på metadata'",

  // Introduction to tool
  wordTrendsIntro: `
  Sök på ett eller flera ord för att se hur de har använts över tid. För att
  söka på flera ord, separera dem med kommatecken, till exempel:
  <code>debatt,information</code>. Sök med <code>*</code> för att få fler varianter, till exempel:
  <code>exempeltext</code>. Under "Filtrera sökresultat" kan du avgränsa
  anförandena till vissa partier, talare eller år. Observera att denna
  test-korpus är lemmatiserad, vilket innebär att sökresultaten baseras på
  ordets grammatiska rot.
`,
};
