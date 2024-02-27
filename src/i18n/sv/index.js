// This is just an example,
// so you can safely delete all default props below

export default {
  failed: "Misslyckades",
  success: "Lyckades",

  // MAIN LAYOUT
  swedeb: "SweDeb",
  home: "Hem",
  tools: "Verktyg",
  about: "Om SweDeb",
  faq: "FAQ",
  contact: "Kontakt",

  indexPageIntroText: `Detta forskningsinfrastrukturprojekt syftar till att tillgängliggöra
  de nyligen annoterade svenska riksdagsdebatterna för det bredare forskarsamhället,
  från åtminstone 1920 till idag. Projektet kommer att
  utveckla ett publikt användargränssnitt - SweDeb - som ska göra det
  möjligt för forskare att få access, filtrera samt att utforska detta unika
  material med hjälp av olika metoder genom detta online-verktyg`,

  wordTrendsTitle: "Ordtrender",
  wordTrendsText:
    "Sök på ett eller flera ord för att se hur de har använts över tid.",
  wordTrendsIcon: "trending_up",
  kwicTitle: "KWIC",
  kwicText: "Se hur ett ord används i olika sammanhang",
  kwicIcon: "o_library_books",
  speechesTitle: "Anföranden",
  speechesText: "Se vilka anföranden specifika personer gjort",
  speechesIcon: "o_campaign",
  nGramsTitle: "N-Gram",
  nGramsText: "Se hur ett ord har använts över tid",
  nGramsIcon: "show_chart",

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

  // NRofWORDS
  nrOfWordsIntro:
    "Välj hur många ord som ska visas till vänster och höger om sökorden",
  nrOfWordsSearch: "Sökord",

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

  kwicIntro: `Med verktyget <strong>Key Words in Context</strong>&nbsp;kan du söka på ord och fraser,
  t ex <code>information</code> eller <code>information om</code>, och se kontexten till vänster och
  höger om sökningen. För att få fler träffar kan&nbsp;<code>.*</code> användas,
  t ex <code>information.*</code>. Under Filtrera sökresultat kan du avgränsa
  anförandena till vissa partier, talare eller år. Observera att denna test-korpus är
  lemmatiserad, dvs sökresultateten baseras på ordets grammatiska rot.`,

  speechesIntro: `Sök på hela anföranden.&nbsp;Under Filtrera sökresultat kan du avgränsa anförandena
  till vissa partier, talare eller år. Observera att du i dagsläget endast kan ladda ner en lista med
  metadata om anföranden och inte talen i sig (men det kommer man kunna göra i den färdiga versionen).`,

  ngramIntro: `Under utveckling.`,

  kwicLable: {
    left_word: "Vänster",
    node_word: "Sökord",
    right_word: "Höger",
    year_title: "År",
    name: "Talare",
    party_abbrev: "Parti",
    speech_title: "Taltitel",
    gender: "Kön",
  },
};
