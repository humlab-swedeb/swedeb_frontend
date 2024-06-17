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

  contactLabelButton: "Kontakta SweDeb-Teamet",

  // MetaDataFilter component ------------------------------------------------
  metaDataFilter: "Filtrera på metadata",
  metaDataFilterMini: "Metadatafilter",
  selectedMetaDataTitle: "Valda filtreringsalternativ:",
  toolsFilterMini: "Verktygsspecifika Filter",

  year: "År",
  office: "Office type",
  subOffice: "Sub office type",
  party: "Parti",
  gender: "Kön",
  speakers: "Talare",
  toggleYes: "Ja",
  toggleNo: "Nej",
  toggleGenderLabel: "Filtrera på kön",
  clearFilter: "Rensa filter",

  toolsFilterTitle: "Verktygsspecifika Filter",
  "/tools/wordtrends": "Ordtrender",
  "/tools/kwic": "Key words in context",
  "/tools/speeches": "Anföranden",
  "/tools/ngram": "N-grams",

  searchButton: "Sök",
  searchTooltipWordtrends: "Lägg till sökord",
  searchTooltipWordtrendsError:
    "I verktyget Ordtrender kan du inte söka på fraser: Ta bort dessa för att genomföra sökningen",
  searchTooltipKWIC_Ngram: "Lägg till ett sökord eller en fras.",
  searchTooltipKWICError:
    "Sökningar i verktyget KWIC kan endast göras på ett ord eller fras i taget",
  searchTooltipNgramError:
    "Sökningar i verktyget N-gram kan endast göras på ett ord eller fras i taget",

  //TOOLS FILTER ------------------------------------------------
  ngramIntro: `Under utveckling.`,
  ngramWidth: "Bredd",
  ngramSizePlaceLabel:
    "Välj storlek på N-gram och var sökordet ska vara placerat",

  searchInput: "Sök på ett ord eller en fras",
  searchAdd: "Lägg till ord",
  searchClear: "Ta bort alla ord",
  searchAddedWords: "Valda ord:",
  searchDropdownOfHits1:
    "Här visas de 10 vanligaste orden relaterade till söktermen med",
  searchDropdownOfHits2: "*",
  searchDropdownOfHits3: "Det finns ytterligare",
  searchDropdownOfHits4: "ord att lägga till för att förfina sökningen.",
  normalizeResultTooltip:
    "Antalet träffar på sökordet delas med det totala antalet ord per år",
  normalizeResultLabel: "Normalisera resultat",
  lemmaResultTooltip:
    "Sökningen tolkas som ett lemma och böjningsformer av sökningen inkluderas i resultatet.",
  lemmaResultLabel: "Lemmatiserad sökning",

  nrOfWordsIntro:
    "Välj hur många ord som ska visas till vänster och höger om sökorden:",
  nrOfWordsSearch: "Sökord",
  nrOfWordsLeft: "Vänster",
  nrOfWordsRight: "Höger",

  speechesNoTools: "Filtrera ovan med hjälp av 'Filtrera på metadata'",

  // Introduction to tool
  wordTrendsIntroTitle:
    "Ordtrender — Sök på ett eller flera ord för att se hur de har använts över tid.",
  wordTrendsIntro: `
  För att söka på flera ord, separera dem med kommatecken, till exempel:
  <code>debatt,information</code>. Sök med <code>*</code> för att få fler varianter, till exempel:
  <code>information*</code>. Under <b>"Filtrera på metadata"</b> kan du avgränsa
  anförandena till vissa partier, talare eller år.`,

  kwicIntroTitle:
    "Key Words in Context — Se hur ord eller fraser har använts i olika sammanhang.",
  kwicIntro: `Med verktyget <strong>Key Words in Context</strong>&nbsp;kan du söka på ord och fraser,
  t ex <code>information</code> eller <code>information om</code>, och se kontexten till vänster och
  höger om sökningen. För att få fler träffar kan&nbsp;<code>*</code> användas,
  t ex <code>information*</code>. Under <b>"Filtrera på metadata"</b> kan du avgränsa
  anförandena till vissa partier, talare eller år.`,

  speechesIntro: `Sök på hela anföranden.&nbsp;Under Filtrera sökresultat kan du avgränsa anförandena
  till vissa partier, talare eller år.`,

  // KWIC
  searchResult1: "Sökningen resulterade i",
  searchResult2: "antal träffar.",
  downloadKWIC: "Ladda ner KWIC",
  downloadCSV: "Ladda ner CSV",
  downloadExcel: "Ladda ner Excel",
  downloadSpeech: "Tal",

  kwicLable: {
    left_word: "Vänster",
    node_word: "Sökord",
    right_word: "Höger",
    year: "År",
    name: "Talare",
    party_abbrev: "Parti",
    title: "Taltitel",
    gender: "Kön",
    person_id: "Person ID",
    link: "Länk",
  },

  // ABOUT PAGE
  aboutPageTitle: "Om SweDeb",
  peopleDevelopment: {
    0: {
      name: "Fredrik Mohammadi Norén",
      title: "Projektledare",
      description: "Fredrik är projektledare för SweDeb.",
    },
    1: {
      name: "Johan Jarlbrink",
      title: "Forskare",
      description: "Johan är utvecklare för SweDeb.",
    },
    2: {
      name: "Rebecka Weegar",
      title: "Systemutvecklare",
      description: "Johan är utvecklare för SweDeb.",
    },
    3: {
      name: "Roger Mähler",
      title: "Systemutvecklare",
      description: "Johan är utvecklare för SweDeb.",
    },
    4: {
      name: "Marita Nilsson",
      title: "Krav och test",
      description: "Johan är utvecklare för SweDeb.",
    },
    5: {
      name: "Kajsa Palm",
      title: "Systemutvecklare, UX/UI",
      description: "Johan är utvecklare för SweDeb.",
    },
  },
  peopleReference: {
    0: {
      name: "Hanna Bäck",
      title: "Forskare",
      description: "Johan är utvecklare för SweDeb.",
    },
    1: {
      name: "Simon Lindgren",
      title: "Forskare",
      description: "Johan är utvecklare för SweDeb.",
    },
    2: {
      name: "Linda Sandström",
      title: "Forskare",
      description: "Johan är utvecklare för SweDeb.",
    },
    3: {
      name: "Måns Magnusson",
      title: "Forskare",
      description: "Johan är utvecklare för SweDeb.",
    },
  },

  // FAQ PAGE
  faqPageTitle: "FAQ: Vanliga frågor och svar",
  faqContent: {
    0: {
      q: "Vad är SweDeb?",
      a: "SweDeb är en förkortning av Swedish Debates. SweDeb är en forskningsinfrastruktur som syftar till att tillgängliggöra de nyligen annoterade svenska riksdagsdebatterna för det bredare forskarsamhället, från åtminstone 1920 till idag. Projektet kommer att utveckla ett publikt användargränssnitt - SweDeb - som ska göra det möjligt för forskare att få access, filtrera samt att utforska detta unika material med hjälp av olika metoder genom detta online-verktyg.",
    },
    1: {
      q: "Vad är syftet med SweDeb?",
      a: "SweDeb syftar till att tillgängliggöra de nyligen annoterade svenska riksdagsdebatterna för det bredare forskarsamhället, från åtminstone 1920 till idag. Projektet kommer att utveckla ett publikt användargränssnitt - SweDeb - som ska göra det möjligt för forskare att få access, filtrera samt att utforska detta unika material med hjälp av olika metoder genom detta online-verktyg.",
    },
  },

  // Expanded table row
  searchWordLabel: "Sökord:",
  wikidata: "Wikidata",
  openSource: "Öppen källa",
  download: "Ladda ner",
  downloadAll: "Ladda ner alla",
  downloadSpeech: "Ladda ner tal",
  downloadWordtrends: "Ladda ner ordtrender",

  downLoadInfo: {
    corpus_version: "Korpusversion: v0.10.0",
    swerik_ref: "Datakälla: https://swerik-project.github.io/",
    swedeb_ref: "Nedladdat från: https://swedeb.se/public/index.html#/",
  },

  accessibility: {
    filtersectionOut: "Fäll ut filtersektionen",
    filtersectionIn: "Fäll in filtersektionen",
    metadataFilter: "Fäll ut och in filter för metadata",
    searchAdd: "Lägg till sökord",
    tooltipSpeechID:
      "Här ska det vara en beskrivning av hur anförande-ID beskrivs",
    loadingResults: "Resultat hämtas, vänligen vänta...",
    noResults: "Inga resultat för sökningen.",
    noResultsTip:
      "Försök igen med ett annat sökord, eller andra filtreringsalternativ.",
  },
};
