// This is just an example,
// so you can safely delete all default props below

export default {
  // MAIN LAYOUT ------------------------------------------------
  swedeb: "SweDeb",
  home: "Hem",
  tools: "Verktyg",
  about: "Om SweDeb",
  faq: "FAQ",
  contact: "Kontakt",

  indexPageIntroText: `Detta forskningsinfrastrukturprojekt syftar till att tillgängliggöra
  de annoterade svenska riksdagsdebatterna för det bredare forskarsamhället.
  Projektet utvecklar ett publikt användargränssnitt - SweDeb - som gör det möjligt
  för forskare att få access, filtrera samt att utforska detta unika material med
  hjälp av olika verktyg. De annoterade riksdagstalen hämtas från samarbetsprojektet`,

  links: {
    swerik: "https://swerik-project.github.io/",
  },

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
  contactText:
    "Har du frågor, synpunkter, eller bara vill lämna feedback till någon i SweDeb-teamet?",

  // MetaDataFilter component -------------------------------------------
  metaDataFilter: "Filtrera på metadata",
  metaDataFilterMini: "Metadatafilter",
  selectedMetaDataTitle: "Valda filtreringsalternativ:",
  toolsFilterMini: "Verktygsspecifika Filter",
  filterAndSearch: "Filtrera och sök",

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
  searchCancel: "Avbryt sökning",
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

  // WORDTRENDS PAGE & COMPONENTS ----------------------------------------
  wordTrendsIntroTitle:
    "Ordtrender — Sök på ett eller flera ord för att se hur de har använts över tid.",
  wordTrendsIntro: `
  För att söka på flera ord, separera dem med kommatecken, till exempel:
  <code>debatt,information</code>. Sök med <code>*</code> för att få fler varianter, till exempel:
  <code>information*</code>. Under <b>"Filtrera på metadata"</b> kan du avgränsa
  anförandena till vissa partier, talare eller år.`,

  wordtrendsResult1: "Här visas resultatet i en",
  wordtrendsResult2: "för de ord och metadata som valts.",
  wordtrendsResult3: "Här visas alla",
  wordtrendsResult4: "i en tabell kopplat till de ord och metadata som valts.",
  wordtrendsResultLine: "trendlinje",
  wordtrendsResultTable: "tabell",
  wordtrendsResultSpeech: "anföranden",

  // KWIC PAGE & COMPONENTS ------------------------------------------------
  kwicIntroTitle:
    "Key Words in Context — Se hur ord eller fraser har använts i olika sammanhang.",
  kwicIntro: `Med verktyget <strong>Key Words in Context</strong>&nbsp;kan du söka på ord och fraser,
  t ex <code>information</code> eller <code>information om</code>, och se kontexten till vänster och
  höger om sökningen. För att få fler träffar kan&nbsp;<code>*</code> användas,
  t ex <code>information*</code>. Under <b>"Filtrera på metadata"</b> kan du avgränsa
  anförandena till vissa partier, talare eller år.`,

  searchResult1: "Sökningen resulterade i",
  searchResult2: "träffar.",
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

  // SPEECHES PAGE & COMPONENTS ------------------------------------------
  speechesIntroTitle: "Anföranden — Sök på Riksdagsanföranden.",
  speechesIntro: `Sök på hela anföranden.&nbsp;Under <b>"Filtrera på metadata"</b> kan du avgränsa anförandena
  till vissa partier, talare eller år.`,

  // ABOUT PAGE ------------------------------------------------
  aboutPageTitle: "Om SweDeb",
  aboutFinance:
    "SweDeb är finansierade av Umeå Universitet under två års tid 2022-2024.",
  aboutTeam: "Teamet bakom SweDeb",
  aboutReference: "Referensgrupp",
  peopleDevelopment: {
    0: {
      name: "Fredrik Mohammadi Norén",
      title:
        "SweDeb:s projektledare, Universitetslektor biträdande, Institutionen för konst, kultur och kommunikation Malmö Universitet",
      email: "fredrik.noren@mau.se",
      description: "",
    },
    1: {
      name: "Johan Jarlbrink",
      title:
        "Universitetslektor, Institutionen för kultur- och medievetenskaper Umeå Universitet",
      description: "",
    },
    2: {
      name: "Rebecka Weegar",
      title: "Systemutvecklare, Humlab Umeå Universitet",
      description: "",
    },
    3: {
      name: "Roger Mähler",
      title: "Systemutvecklare, Humlab Umeå Universitet",
      description: "",
    },
    5: {
      name: "Marita Nilsson",
      title: "Krav och test, tidigare Humlab Umeå Universitet",
      description: "",
    },
    4: {
      name: "Kajsa Palm",
      title: "Systemutvecklare, UX/UI, Humlab Umeå Universitet",
      description: "",
    },
  },
  peopleReference: {
    0: {
      name: "Hanna Bäck",
      title: "Professor, Statsvetenskapliga institutionen Lunds Universitet",
      description: "",
    },
    1: {
      name: "Simon Lindgren",
      title: "Professor, Sociologiska institutionen Umeå Universitet",
      description: "",
    },
    2: {
      name: "Linda Sandström",
      title:
        "Biträdande universitetslektor, Institutionen för språkstudier Umeå Universitet",
      description: "",
    },
    3: {
      name: "Måns Magnusson",
      title:
        "Universitetslektor, Statistiska institutionen Uppsala Universitet",
      description: "",
    },
  },

  // FAQ PAGE ------------------------------------------------
  faqPageTitle: "FAQ: Vanliga frågor och svar",
  faqContent: {
    0: {
      q: "Vad är SweDeb?",
      a: "SweDeb är en förkortning av Swedish Debates och är ett forskningsinfrastrukturprojekt som finansieras av Umeå Universitet.",
    },
    1: {
      q: "Vad är syftet med SweDeb?",
      a: `Syftet med SweDeb är att tillgängliggöra de annoterade svenska riksdagsdebatterna för det bredare forskarsamhället. Projektet utvecklar ett publikt användargränssnitt - SweDeb - som gör det möjligt för forskare att få access, filtrera samt att utforska detta unika material med hjälp av olika metoder.`,
    },
    2: {
      q: "Varifrån kommer materialet till SweDeb?",
      a: "De annoterade riksdagstalen hämtas från samarbetsprojektet Swerik. Talen är kopplade till riksdagsledamot med metadata för bland annat parti, kön och år.",
      link: "https://swerik-project.github.io/",
      linkText: "Läs mer om Swerik här.",
    },
    3: {
      q: "Vilka typer av brister finns i materialet?",
      a: "Även om kvalitén är god finns det brister i materialet. Talen har till exempel inte alltid blivit rätt segmenterade (var talet börjar och slutar) och kopplingen mellan talarintroduktion och talande ledamot är inte fullständig.",
      link: "https://github.com/swerik-project/the-swedish-parliament-corpus",
      linkText: "Mer information om kvalitén finns här.",
    },
  },

  // Expanded table row & DOWNLOAAD------------------------------------------
  searchWordLabel: "Sökord:",
  wikidata: "Wikidata",
  openSource: "Öppna källa",
  download: "Ladda ner",
  downloadAll: "Ladda ner alla",
  downloadSpeech: "Ladda ner tal",
  downloadWordtrends: "Ladda ner ordtrender",

  //Download metadata ------------------------------------------------
  downLoadInfo: {
    corpus_version: "Korpusversion: v0.10.0",
    swerik_ref: "Datakälla: https://swerik-project.github.io/",
    swedeb_ref: "Nedladdat från: https://swedeb.se/public/index.html#/",
  },

  //ACCessibility ------------------------------------------------
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

    errorMessage404: "Hoppsan, här fanns inget!",
    errorMessageButton: "Tillbaka till startsidan",
    metadataMissing: "metadata saknas",
  },

  //REPORT BUGS/ FEEDBACK ----------------------------------------------
  meta: "Metadata",
  reportTitle: "Rapportera fel i anföranden, dess metadata, eller ge feedback",
  reportText:
    "För att lämna feedback eller rapportera fel, vänligen kopiera metadatan nedan och gå sedan vidare till SweRik:s GitHub-sida för att skapa en diskussion. Klistra där in metadatan och förklara vad som är fel och eventuella ändringsförslag.",
};
