// This is just an example,
// so you can safely delete all default props below

export default {
  links: {
    swerik: "https://swerik-project.github.io/",
    swerik_version: "https://github.com/swerik-project/riksdagen-records",
    swerik_persons: "https://github.com/swerik-project/riksdagen-persons",
    humlab: "https://umu.se/humlab",
    huminfra: "https://www.huminfra.se/",
    swedebGithub: "https://github.com/humlab-swedeb",
  },

  dataVersion: "Data-version:",
  dataVersionLinkText: "SWERIK-records 1.4.1",
  personVersionText: "SWERIK-persons 1.1.3",
  // MAIN LAYOUT ------------------------------------------------
  swedeb: "Riksdagsdebatter.se",
  home: "Hem",
  tools: "Verktyg",
  about: "Om Riksdagsdebatter",
  faq: "FAQ",
  contact: "Kontakt",

  // INDEX PAGE ------------------------------------------------
  indexPageTitle: "Utforska och läs riksdagsanföranden sedan 1867",
  indexPageIntroText: `Riksdagsdebatter.se är skapad för att göra det lättare att utforska,
  läsa och ladda ner anföranden av svenska riksdagsledamöter och andra som talat i riksdagen
  sedan 1867. Gränssnittet är utvecklat inom projektet ”Svenska riksdagsdebatter” med
  finansiering av Umeå universitet och `,
  indexPageIntroText2: `vid samma universitet. Det dataset med
  annoterade anföranden som Riksdagsdebatter.se bygger på hämtas från
  forskningsinfrastrukturprojektet`,

  wordTrendsTitle: "Ordtrender",
  wordTrendsText:
    "Sök på ett eller flera ord för att se hur de har använts över tid.",
  wordTrendsIcon: "trending_up",
  kwicTitle: "KWIC",
  kwicText: "Se hur ett ord eller en fras har använts i olika sammanhang.",
  kwicIcon: "o_library_books",
  speechesTitle: "Anföranden",
  speechesText: "Filtrera fram, läs och ladda ner anföranden.",
  speechesIcon: "o_campaign",
  nGramsTitle: "N-Gram",
  nGramsText:
    "Se vilka som är de mest förekommande orden före och efter ett visst sökt ord eller en fras.",
  nGramsIcon: "show_chart",

  contactLabelButton: "Kontakta Riksdagsdebatter.se",
  contactText:
    "Har du frågor, synpunkter, eller bara vill lämna feedback till någon i Riksdagsdebatter.se-teamet?",

  // MetaDataFilter component -------------------------------------------
  metaDataFilter: "Filtrera på metadata",
  metaDataFilterMini: "Metadatafilter",
  selectedMetaDataTitle: "Valda filtreringsalternativ:",
  toolsFilterMini: "Verktygsspecifika filter",
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
  toggleChamberLabel: "Filtrera på kammare",
  clearFilter: "Rensa filter",
  chamber: "Kammare",
  yearInterval: "Årsintervall",
  parties: "partier",

  toolsFilterTitle: "Verktygsspecifika filter",
  "/tools/wordtrends": "Ordtrender",
  "/tools/kwic": "Key Words in Context",
  "/tools/speeches": "Anföranden",
  "/tools/ngram": "N-gram",

  searchButton: "Sök",
  searchCancel: "Avbryt sökning",
  searchTooltipWordtrends: "Lägg till ord och klicka på +",
  searchTooltipWordtrendsError:
    "I verktyget Ordtrender kan du inte söka på fraser: Ta bort dessa för att genomföra sökningen",
  searchTooltipKWIC_Ngram: "Lägg till ett sökord eller en fras.",
  searchTooltipKWICError:
    "Sökningar i verktyget KWIC kan endast göras på ett ord eller fras i taget",
  searchTooltipNgramError:
    "Sökningar i verktyget N-gram kan endast göras på ett ord eller fras i taget",
  tooltipChamber:
    "Första och Andra kammare användes fram till och med 1970, därefter enkammare i form av Sveriges riksdag.",

  //TOOLS FILTER ------------------------------------------------
  ngramIntro: `Under utveckling.`,
  ngramWidth: "Bredd",
  ngramSizePlaceLabel:
    "Välj storlek på N-gram och var sökordet ska vara placerat:",
  tooltipNgramSize:
    "För närvarande räknas även skiljetecken som ord, till exempel . , : –",

  searchInput: "Sök på ett ord eller en fras",
  searchAdd: "Lägg till ord och klicka på +",
  searchClear: "Ta bort alla ord",
  searchAddedWords: "Valda ord:",
  searchDropdownOfHits1:
    "Här visas de 5 vanligaste orden relaterade till söktermen med",
  searchDropdownOfHits2: "*",
  searchDropdownOfHits3: "Det finns ytterligare",
  searchDropdownOfHits4: "ord att lägga till för att förfina sökningen.",

  normalizeResultTooltip:
    "Antalet träffar på sökordet delas med det totala antalet ord per år",
  normalizeResultLabel: "Normalisera resultat",

  lemmaResultTooltip:
    "Om du aktiverar denna funktion tolkas sökorden som lemma och olika böjningsformer inkluderas i sökresultatet. Sökorden måste vara skrivna i sin grundform för att lemmatiseringen ska fungera, t ex ”frihet” och inte ”friheten”",
  lemmaResultLabel: "Lemmatiserad sökning",

  nrOfWordsIntro:
    "Välj hur många ord som ska visas till vänster och höger om sökorden:",
  tooltipKWIC:
    "För närvarande räknas även skiljetecken som ord, till exempel . , : –",
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
  <code>frihet, jämlikhet</code>. Sök med <code>*</code> för att få fler ordvarianter, till exempel:
  <code>frihet*</code>. Under <b>"Filtrera på metadata"</b> kan du avgränsa
  anförandena till bland annat vissa partier, talare eller år.`,

  wordtrendsResult1: "Här visas resultatet i en",
  wordtrendsResult2: "för de ord och metadata som valts.",
  wordtrendsResult3: "Här visas alla",
  wordtrendsResult4: "i en tabell kopplat till de ord och metadata som valts.",
  wordtrendsResultLine: "trendlinje",
  wordtrendsResultTable: "tabell",
  wordtrendsResultSpeech: "anföranden",

  // KWIC PAGE & COMPONENTS ------------------------------------------------
  kwicIntroTitle:
    "Key Words in Context — Sök på ett ord eller en fras och se hur de har använts i olika sammanhang.",
  kwicIntro: `Med verktyget <strong>Key Words in Context</strong>&nbsp;kan du söka på ord och fraser,
  till exempel <code>jämlikhet</code> eller <code>jämlikhet för</code>, och se kontexten till vänster och
  höger om sökningen. För att få fler träffar kan&nbsp;<code>*</code> användas,
  till exempel <code>frihet*</code>. Under <b>"Filtrera på metadata"</b> kan du avgränsa
  anförandena till bland annat vissa partier, talare eller år.`,

  speechesIntro: `Sök på hela anföranden.&nbsp;Under Filtrera sökresultat kan du avgränsa anförandena
  till vissa partier, talare eller år.`,

  ngramIntroTitle:
    "N-grams — Sök på ett ord eller en fras och se hur de har använts i olika sammanhang.",
  ngramIntro: `
  Med verktyget <strong>N-gram</strong> kan du söka på ord och fraser, till exempel
  <code>jämlikhet</code> eller <code>jämlikhet för</code>, och få fram en lista med mest
  förekommande N-grams (beroende på dess storlek) före och/eller efter sökordet eller sökfrasen.
   Här måste du söka på exakta ord fraser (<code>*</code> kan inte användas).
  Under <b>”Filtrera på metadata”</b> kan du avgränsa anförandena till bland
  annat vissa partier, talare eller år.`,

  searchResult1: "Sökningen resulterade i ",

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
  speechesIntroTitle:
    "Anföranden — Sök på och filtrera fram riksdagsanföranden.",
  speechesIntro: `Sök på hela anföranden.&nbsp;Under <b>"Filtrera på metadata"</b> kan du
  avgränsa anförandena till bland annat vissa partier, talare eller år.`,

  // PDF PAGE ------------------------------------------------
  pageNrInfoText: "OBS, det kan vara nödvändigt att bläddra ett par sidor för att komma till rätt anförande",
  nextPage: "Nästa sida",
  previousPage: "Föregående sida",
  zoomIn: "Zooma in",
  zoomOut: "Zooma ut",
  closeSpeech: "Stäng anförande",
  riksdagenLinkText: "För mer information om riksdagsprotokollet och andra relaterade dokument, se",
  riksdagenLink: "https://www.riksdagen.se",

  // ABOUT PAGE ------------------------------------------------
  aboutPageTitle: "Om Riksdagsdebatter.se",
  aboutPageIntroText: `Riksdagsdebatter.se är skapad för att göra det lättare att utforska,
  läsa och ladda ner anföranden av svenska riksdagsledamöter och andra som talat i
  riksdagen sedan 1867. Gränssnittet är utvecklat inom projektet ”Svenska riksdagsdebatter” med finansiering av Umeå universitet och Swerik. GitHub används som utvecklingsplattform för Riksdagsdebatter.se och du finner den öppna källkoden`,

  aboutFinance:
    "Riksdagsdebatter.se primära finansiärer är Umeå universitet, Humlab samt",
  financiers: {
    0: {
      alt: "Umeå universitet logo",
      src: "/public/images/umu-logo-left-SE.png",
      style: "width: 200px",
    },
    1: {
      alt: "Humlab logo",
      src: "/public/images/humlab_logo_left_se.png",
      style: "width: 250px",
    },
    2: {
      alt: "Huminfra logo",
      src: "/public/images/HumInfra_3_b.png",
      style: "width: 150px",
    },
  },

  aboutTeam: "Teamet bakom Riksdagsdebatter.se",
  aboutReference: "Referensgrupp",
  peopleDevelopment: {
    0: {
      name: "Fredrik Mohammadi Norén",
      title:
        "Riksdagsdebatter.se:s projektledare, Institutionen för konst, kultur och kommunikation, Malmö Universitet",
      link: "https://mau.se/personer/fredrik.noren/",
    },
    1: {
      name: "Johan Jarlbrink",
      title: "Institutionen för kultur- och medievetenskaper, Umeå Universitet",
      link: "https://www.umu.se/personal/johan-jarlbrink/ ",
    },
    2: {
      name: "Rebecka Weegar",
      title: "Humlab, Umeå Universitet",
      link: "https://www.umu.se/personal/rebecka-weegar/",
    },
    3: {
      name: "Roger Mähler",
      title: "Humlab, Umeå Universitet",
      link: "https://www.umu.se/personal/roger-mahler/",
    },
    /*     5: {
      name: "Marita Nilsson",
      title: "Krav och test, tidigare antsälld på Humlab Umeå Universitet",
      link: "https://www.umu.se/personal/marita-nilsson/ ",
    }, */
    4: {
      name: "Kajsa Palm",
      title: "Humlab, Umeå Universitet",
      link: "https://www.umu.se/personal/kajsa-palm/",
    },
  },
  peopleReference: {
    0: {
      name: "Hanna Bäck",
      title: "Statsvetenskapliga institutionen, Lunds Universitet",
    },
    1: {
      name: "Simon Lindgren",
      title: "Sociologiska institutionen, Umeå Universitet",
    },
    2: {
      name: "Måns Magnusson",
      title: "Statistiska institutionen, Uppsala Universitet",
    },
    3: {
      name: "Leif-Jöran Olsson",
      title:
        "Institutionen för svenska, flerspråkighet och språkteknologi, Göteborgs universitet",
    },
    4: {
      name: "Josefin Hägglund",
      title:
        "Institutionen för samhälle, kultur och identitet, Malmö universitet",
    },
    5: {
      name: "Claes Ohlsson",
      title: "Institutionen för svenska språket, Linnéuniversitetet",
    },
    6: {
      name: "Roger Mähler",
      title: "Humlab, Umeå universitet",
    },
  },

  // FAQ PAGE ------------------------------------------------
  faqPageTitle: "FAQ: Vanliga frågor och svar",
  faqContent: {
    0: {
      q: "Hur funkar kopplingen mellan talare och parti?",
      a: `Partifiltreringen bygger på det annoteringsarbetet som gjorts i SWERIK-projektet.
      SWERIK har byggt upp en databas med svenska riksdagsdagsledamöter sedan 1867 där varje
      ledamot är kopplad till olika metadata-kategorier (bl a födelsedatum, kön och parti).
      En länk till en katalog med alla ledamöter finns nedan. Via ledamotsdatabasen har
      SWERIK kopplat ihop ledamöter – liksom ministrar som inte var ledamöter men som
      också har rätt att tala i riksdagen – med deras respektive anföranden i
      kammarprotokollen. Denna koppling har gjorts genom att identifiera ledamoten
      i respektive talarintroduktion i protokollen. Kopplingen mellan rätt ledamot
      och rätt anföranden är inte komplett och ibland är den felaktig. SWERIK-projektet
      försöker kontinuerligt att arbeta med annoteringskvalitén på anförandena.`,

      links: {
        0: {
          link: "https://swerik-project.github.io/",
          linkText: "Läs mer om SWERIK.",
        },
        1: {
          link: "https://swerik-project.github.io/person-catalog/",
          linkText: "Katalog med alla ledamöter.",
        },
      },
    },
    1: {
      q: "Var kommer listan med partier ifrån?",
      a: `Listan med partier som används bygger på främst Sten Carlssons partiförteckning i
      biografbandserien <i>Tvåkammarriksdagen 1867–1970: Ledamöter och valkretsar (1988).</i>
      Bilden nedan är hämtad från Carlssons kapitel i biografiböckerna.
      Den visar utvecklingen av partibildningar, partisplittringar och partisammanslagningar
      under hela tvåkammartiden, från 1867 till 1970. Information om senare partier som har
      tillkommit under enkammarriksdagen (1970–) har hämtats från riksdagens register.
      Till varje parti i Riksdagsdebatter.se anges det år som partiet första gången
      representerades i riksdagen och eventuellt till det sista året i riksdagen, enlig
      den information som finns i Carlssons kapitel och i riksdagens register.
</br></br>
      I Riksdagsdebatter.se kan du bara välja mellan partier som formellt har varit
      representerade i riksdagen. Det är därför som till exempel Feministiskt initiativ
      inte finns med. Ledamöter som aldrig tillhörde ett parti (vilket var mer vanligt
      under 1800-talet) finns under kategorin ”Utan partibeteckning”. Det gör även flera
      ledamöter som hoppat av ett parti under mandatperioden.

      <img src="/images/parti.png" alt="Partiutveckling" style="width: 100%; margin-top: 20px;" />

</br></br>
      Det är viktigt att känna till att ett parti på 1800-talet inte är samma sak som
      ett parti idag. I början av tvåkammarriksdagen hade partier en betydligt lösare
      form än dagens partiorganisationer. Man brukar säga att Socialdemokraterna var
      det första så kallade moderna partiet i Sverige.
</br></br>
      Partinamnen som används i Riksdagsdebatter.se bygger på de namn som anges i
      biografibanden för tvåkammarriksdagen. Många av partiförkortningarna är däremot
      konstruerade av teamet bakom Riksdagsdebatter.se.
</br></br>
      Vissa moderna partier har haft olika namn under årens lopp. I Riksdagsdebatter.se
      har följande partinamn slagits ihop:
      <ul>
        <li>
          Centerpartiet – inkluderar Bondeförbundet som senare bytte namn till Centerpartiet.
          Utifrån denna logik startade Centerpartiet 1922.
        </li>
        <li>
          Liberalerna – inkluderar Liberala samlingspartiet och Frisinnade
          folkpartiet som sedan blev Folkpartiets riksdagsgrupp och senare bytte
          namn till Liberalerna. Dock inkluderas inte Liberala riksdagspartiet
          (1924–1934) som här betraktas som ett utbrytarparti. Utifrån denna
          logik startade Liberalerna 1900.
        </li>
        <li>
          Vänsterpartiet – inkluderar Socialdemokratiska vänstergruppen,
          Kommunistiska partiets riksdagsgrupp och Vänsterpartiet kommunisternas
          riksdagsgrupp. Utifrån denna logik startade Vänsterpartiet 1917.
        </li>
        <li>Moderaterna – givet den större komplexitet som råder kring
          partierna som var knutna till Allmänna valförbundet har Riksdagsdebatter.se
          valt att enbart inkludera Högerns riksdagsgrupp som sedan bytte namn till
          Moderaterna. Utifrån denna logik startade Moderaterna 1935.
        </li>
      </ul>`,
    },
    2: {
      q: "Vad står partiförkortningarna för?",
      a: `Partinamnen som används i Riksdagsdebatter.se bygger på de namn som anges
      i biografibanden <i>Tvåkammarriksdagen 1867–1970: Ledamöter och valkretsar (1988)</i>
      samt information från riksdagens register. Många av partiförkortningarna är
      däremot konstruerade av teamet bakom Riksdagsdebatter.se.`,
      a: `Partinamnen som används i Riksdagsdebatter.se bygger på de namn som anges
      i biografibanden <i>Tvåkammarriksdagen 1867–1970: Ledamöter och valkretsar (1988)</i>
      samt information från riksdagens register. Många av partiförkortningarna är
      däremot konstruerade av teamet bakom Riksdagsdebatter.se.
</br></br>
      <ul style="list-style-type: none; padding: 0; margin: 0;">
        <li><b>AK-bd</b>: AK:s bondeska diskussionsklubben (1897–1899)</li>
        <li><b>AK-c89</b>: AK:s center (1889–1894)</li>
        <li><b>AK-ch</b>: AK:s center-högern (1883–1886)</li>
        <li><b>AK-c73</b>: AK:s centern (1873–1882)</li>
        <li><b>AK-mrg</b>: AK:s de moderata reformvännernas grupp (1903–1905)</li>
        <li><b>AK-fp</b>: AK:s folkpartiet (1895–1899)</li>
        <li><b>AK-fd</b>: AK:s friesenska diskussionsklubben (1897–1899)</li>
        <li><b>AK-frip</b>: AK:s frihandelsparti (1887–1888)</li>
        <li><b>AK-fc</b>: AK:s frihandelsvänliga centern (1895–1897)</li>
        <li><b>AK-ff</b>: AK:s frisinnade försvarsvänner (1914)</li>
        <li><b>AK-glmp</b>: AK:s gamla lantmannapartiet (1888–1894)</li>
        <li><b>AK-lb</b>: AK:s lantmanna- och borgarepartiet (1912–1934)</li>
        <li><b>AK-lmp</b>: AK:s lantmannapartiet (1867–1887, 1895–1911)</li>
        <li><b>AK-lmpf</b>: AK:s lantmannapartiets filial (1873–1887)</li>
        <li><b>AK-minip</b>: AK:s ministeriella partiet (1867–1872)</li>
        <li><b>AK-nf</b>: AK:s nationella framstegspartiet (1906–1911)</li>
        <li><b>AK-ng</b>: AK:s nationella gruppen (1935-1936)</li>
        <li><b>AK-nc83</b>: AK:s nya centern (1883–1887)</li>
        <li><b>AK-nc95</b>: AK:s nya centern (1895–1896)</li>
        <li><b>AK-nlmp</b>: AK:s nya lantmannapartiet (1888–1894)</li>
        <li><b>AK-np</b>: AK:s nyliberala partiet (1868–1871)</li>
        <li><b>AK-v</b>: AK:s vänstern (1886)</li>
        <li><b>C</b>: Centerpartiet (1922–)</li>
        <li><b>FK-c</b>: FK:s centern (1885–1887)</li>
        <li><b>FK-fh</b>: FK:s det förenade högerpartiet (1910–1911)</li>
        <li><b>FK-ep</b>: FK:s ehrenheimska partiet (1873–1887)</li>
        <li><b>FK-kg</b>: FK:s konservativa grupp (1867–1872)</li>
        <li><b>FK-mg</b>: FK:s ministeriella grupp (1867–1872)</li>
        <li><b>FK-minop</b>: FK:s minoritetsparti (1888–1904)</li>
        <li><b>FK-modp</b>: FK:s moderata parti (1905–1911)</li>
        <li><b>FK-np</b>: FK:s nationella parti (1912–1934)</li>
        <li><b>FK-pp</b>: FK:s protektionistiska parti (1888–1909)</li>
        <li><b>FK-v</b>: FK:s vänstern (1886)</li>
        <li><b>Jfg</b>: Jordbrukarnas fria grupp (1918–1921)</li>
        <li><b>Kp</b>: Kilbomspartiet (1930–1933)</li>
        <li><b>Kd</b>: Kristdemokraterna (1985–)</li>
        <li><b>Lrp</b>: Liberala riksdagspartiet (1924–1934)</li>
        <li><b>L</b>: Liberalerna (1900–)</li>
        <li><b>Ms</b>: Medborgerlig samling (1964–1968)</li>
        <li><b>Mp</b>: Miljöpartiet (1988–)</li>
        <li><b>M</b>: Moderaterna (1935–)</li>
        <li><b>Nyd</b>: Ny demokrati (1991–1994)</li>
        <li><b>S</b>: Socialdemokraterna (1897–)</li>
        <li><b>Sp</b>: Socialistiska partiet (1934–1940)</li>
        <li><b>Sd</b>: Sverigedemokraterna (2010–)</li>
        <li><b>V</b>: Vänsterpartiet (1917–)</li>
      </ul>`,
    },
    3: {
      q: "Vad är ett kammarprotokoll?",
      a: `Ett kammarprotokoll eller kammarens protokoll är den dokumenttyp
      i riksdagstrycket där ledamöternas anföranden finns registrerade,
      liksom information om voteringar och beslut. Där finns ca 18,000
      protokoll sedan 1867. Du kan ta del av protokollen på Riksdagens hemsida.`,
      links: {
        0: {
          link: "https://www.riksdagen.se/sv/sok/?avd=dokument",
          linkText: "Sök på Riksdagens hemsida.",
        },
      },
    },
    4: {
      q: "Varför finns det länkar till varje talares sida på Wikidata?",
      a: `SWERIK-projektet har byggt upp en databas med svenska riksdagsledamöter
      från 1867 och framåt via Wikidata. Det gör att alla är välkomna att bidra med
      att lägga till information om ledamöterna. Den information som används i
      Riksdagsdebatter.se är dock begränsad till bland annat parti, levnadsår och kön.
      SWERIK har en katalog med alla svenska riksdagsledamöter. `,
      links: {
        0: {
          link: "https://swerik-project.github.io/",
          linkText: "Läs mer om SWERIK.",
        },
        1: {
          link: "https://swerik-project.github.io/person-catalog/",
          linkText: "Katalog med alla ledamöter.",
        },
      },
    },
    5: {
      q: "Varför saknas det anföranden till vissa ledamöter?",
      a: `Riksdagsdebatter.se hämtar sin data från SWERIK-projektet. Tal och talare
      kopplas ihop genom en kombination av maskininlärning och manuellt kontrollarbete.
      Det sker genom att först identifiera talarintroduktioner i kammarprotokollen
      och sedan identifiera vem som nämns i talarintroduktionen och koppla den personen
      till databasen med ledamöter. Vissa talarintroduktioner kan vara enkla att identifiera
      som människa men svåra att identifiera och koppla samman för en algoritm.
      En talarintroduktion från 1875 som ”Grefve af Ugglas:” kan till exempel vara svår
      för algoritmen att upptäcka dels på grund av den äldre stavningsformen, och dels om det
      gäller Ludvig af Ugglas (1814–1880) eller Gustaf af Ugglas (1820–1895) som under en
      period var ledamöter samtidigt i första kammaren.
</br></br>
      SWERIK har annoterar över en miljon anföranden i kammarprotokollen sedan 1867.
      Det betyder till exempel att om en ledamot saknar 100 anföranden utgör det cirka
      0,0001 % av samtliga anföranden. Men SWERIK-projektet försöker kontinuerligt att
      arbeta med kvalitén på kopplingen mellan tal och talare. `,
      links: {
        0: {
          link: "https://swerik-project.github.io/",
          linkText: "Läs mer om SWERIK.",
        },
      },
    },
    6: {
      q: "Varför slutar vissa anföranden mitt i?",
      a: `SWERIK-projektet har annoterat (dvs märkt upp) innehållet i protokollen för
      att bland annat särskilja mellan vad som är en talarintroduktion, vad som är ett
      anförande, och vad som är annan text i protokollen. Detta arbete sker iterativt
      genom att kombinera maskininlärning med manuellt kontrollarbete. På så sätt
      förbättras kvalitén successivt men det innebär också att det kan förekomma fel
      i annoteringen, till exempel att textblock som egentligen tillhör ett anförande
      har blivit annoterat som något annat. SWERIK-projektet försöker kontinuerligt
      att arbeta med annoteringskvalitén på anförandena. `,
      links: {
        0: {
          link: "https://swerik-project.github.io/",
          linkText: "Läs mer om SWERIK.",
        },
      },
    },
    7: {
      q: "Varför finns det text i anförandet som inte tillhör själva talet?",
      a: `SWERIK-projektet har annoterat (dvs märkt upp) innehållet i protokollen för
      att bland annat särskilja vad som är en talarintroduktion, vad som är ett anförande,
      och vad som är annan text i protokollen. Detta arbete sker iterativt genom att
      kombinera maskininlärning med manuellt kontrollarbete. På så sätt förbättras
      kvalitén successivt men det innebär också att det kan förekomma fel i annoteringen,
      till exempel att textblock som egentligen inte tillhör ett anförande har blivit annoterat
      som en del av anförandet (t ex texten i sidhuvudet). SWERIK-projektet försöker
      kontinuerligt att arbeta med annoteringskvalitén på anförandena. `,
      links: {
        0: {
          link: "https://swerik-project.github.io/",
          linkText: "Läs mer om SWERIK.",
        },
      },
    },
    8: {
      q: "Varför är det konstiga radbrytningar och stavfel i talen?",
      a: `SWERIK-projektet bygger på de digitaliserade kammarprotokollen som har utförts av
      Riksdagsbiblioteket. Det är inte ovanligt att textblock på en sida kan representeras på
      lite konstiga sätt i digitaliseringsprocessen. Vissa textblock består till exempel bara
      av enskilda och avhuggna rader medan andra av riktiga paragrafer. När talen representeras
      i Riksdagsdebatter.se kan det därför hända att ett tal som egentligen utgörs av en
      sammanhängande paragraf är uppstyckat i flera kortare segment
</br></br>
      Ibland händer också att digitaliseringsprocessen skapar en felaktig OCR-läsning.
      OCR står för Optical Character Recognition och är en datorteknik för att identifiera
      texten på en digitaliserad sida. I en text som är OCR-skannad går det till exempel att
      söka efter ord. Ibland händer det dock att textöverföringen i OCR-skanningen blir fel och
      att vissa ord ges en felaktig representation. Till exempel kan ”om” blir ”örn” om
      bokstaven o lästs som ö och m misstolkats som bokstäverna r och n. `,
      links: {
        0: {
          link: "https://swerik-project.github.io/",
          linkText: "Läs mer om SWERIK.",
        },
      },
    },
    9: {
      q: "Hur mycket data och material bygger Riksdagsdebatter.se på?",
      a: `Alla anföranden och information om riksdagsledamöter som avänds i Riksdagdebatter.se
      kommer ursprungligen från de svenska riksdagsprotokollen och andra källor som riksdagen
      har varit med och producerat. Med hjälp av automatiska maskininlärningsmodeller och manuellt
      kontrollarbete har alla protokoll har processats av SWERIK-projektet för att identifiera
      enskilda anföranden och för att koppla ihop dessa med respektive ledamot.
</br></br>
      På grund av det stora materialet är det svårt för modellerna att uppnå 100 % träffsäkerhet,
      till exempel vad gäller att identifiera alla anföranden och koppla dessa till rätt ledamot.
      Den statistiskt uppskattade träffsäkerheten för att koppla samman anföranden med rätt ledamot
      är över 90 % efter 1900 (och ofta över 95 % efter 1920). Du kan följa kvalitén i den senaste
      versionen på SWERIKs GitHub-sida.
</br></br>
      Generell information om den anförande-data som SWERIK har förfinat finns i konferenspapret
      "The Swedish Parliament Corpus 1867–2022" som publicerades på LREC-Coling 2024 2024.
      I stora drag bygger Riksdagsdebatter.se på följande dataset (sedan 1867):
      <ul>
        <li>ca 18,000 riksdagsprotokoll</li>
        <li>ca 1,000,000 annoterade anföranden från riksdagsprotokollen</li>
        <li>ca 6,000 riksdagsledamöter. SWERIK har även skapat en egen katalog med riksdagsledamöter.</li>
      </ul>`,
      links: {
        0: {
          link: "https://swerik-project.github.io/",
          linkText: "Läs mer om SWERIK.",
        },
        1: {
          link: "https://github.com/swerik-project/the-swedish-parliament-corpus",
          linkText: "SWERIKs GitHub-sida.",
        },
        2: {
          link: "https://aclanthology.org/2024.lrec-main.1400.pdf",
          linkText: "The Swedish Parliament Corpus 1867–2022.",
        },
        3: {
          link: "https://swerik-project.github.io/person-catalog/",
          linkText: "Katalog med alla ledamöter.",
        },
      },
    },
    10: {
      q: "Var är det en pik/dipp runt 1975 när jag söker i ordtrenderverktyget?",
      a: `Riskdagen ändrade från hela kalenderår till riksdagsår (cirka september till juni) 1975/1976. 
      Det påverkade även vilka år som angavs i riksdagsprotokollens namn (t ex från 1972 till 1978/79).
      Detta skifte påverkar i nuläget även hur ordfrekvenserna presenteras i riksdagsdebatter.se.`,
    },
  },

  // Expanded table row & DOWNLOAAD------------------------------------------
  searchWordLabel: "Sökord:",
  wikidata: "Wikidata",
  openSource: "Öppna källa",
  download: "Ladda ner",
  downloadAll: "Ladda ner alla",
  downloadSpeech: "Ladda ner anföranden",
  downloadWordtrends: "Ladda ner ordtrender",
  downloadNgram: "Ladda ner N-gram",

  //Download metadata ------------------------------------------------
  downLoadInfo: {
    corpus_version: "Data-version: SWERIK-records 1.4.1, SWERIK-persons 1.1.3",
    swerik_ref:
      "SWERIK-records: https://github.com/swerik-project/riksdagen-records",
    swerik_persons:
      "SWERIK-persons: https://github.com/swerik-project/riksdagen-persons",
    swedeb_ref:
      "Nedladdat från: https://riksdagsdebatter.se.se/public/index.html#/",
  },

  //ACCessibility ------------------------------------------------
  accessibility: {
    filtersectionOut: "Fäll ut filtersektionen",
    filtersectionIn: "Fäll in filtersektionen",
    metadataFilter: "Fäll ut och in filter för metadata",

    searchAdd: "Lägg till sökord",
    tooltipSpeechID:
      "För anförande före 1971 anges kammare (Första/Andra) sedan riksmötesår och protokollnummer. Det sista numret anger vilken ordning anförandet har i protokollet.",
    loadingResults: "Resultat hämtas, vänligen vänta...",

    noResults: "Inga resultat för sökningen.",
    noResultsTip:
      "Försök igen med ett annat sökord, eller andra filtreringsalternativ.",

    errorMessage404: "Hoppsan, här fanns inget!",
    errorMessageButton: "Tillbaka till startsidan",
    metadataMissing: "metadata saknas",
    speakerMissing: "talardata saknas",
    genderMissing: "köndata saknas",
    partyMissing: "partidata saknas",
  },

  //REPORT BUGS/ FEEDBACK ----------------------------------------------
  meta: "Metadata om anförande",
  reportTitle: "Rapportera fel i anföranden, dess metadata, eller ge feedback",
  reportText:
    "För att lämna feedback eller rapportera fel (t ex om segmenteringen av anföranden eller om metadatan kopplade till ledamöter), vänligen kopiera metadatan nedan om detta specifika anförande och gå sedan vidare till SWERIK:s GitHub-sida för att skapa ett diskussionsärende. Klistra där in metadatan och förklara vad som är fel och eventuella ändringsförslag.",
  githubLink: "Gå vidare till SWERIK:s GitHub-sida",
};
