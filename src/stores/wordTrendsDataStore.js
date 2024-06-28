import { defineStore } from "pinia";
import { api } from "boot/axios";
import { metaDataStore } from "./metaDataStore";
import JSZip from "jszip";
import ExcelJS from "exceljs";

export const wordTrendsDataStore = defineStore("wordTrendsData", {
  state: () => ({
    wordTrends: [],
    speechesData: [],
    searchText: "",
    wordHits: [],
    wordHitsSelected: [],
    searchString: [],
    ifAsterisk: false,
    normalizeResults: false,
  }),

  actions: {
    async getWordTrendsResult(search) {
      if (search === "hundskatt") {
        this.wordTrends = [{"year":1920,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1921,"count":{"hundskatt Män":3,"hundskatt Kvinnor":0,"Totalt":3}},{"year":1922,"count":{"hundskatt Män":15,"hundskatt Kvinnor":0,"Totalt":15}},{"year":1923,"count":{"hundskatt Män":2,"hundskatt Kvinnor":0,"Totalt":2}},{"year":1924,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1925,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1926,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1927,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1928,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1929,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1930,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1931,"count":{"hundskatt Män":2,"hundskatt Kvinnor":0,"Totalt":2}},{"year":1932,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1933,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1934,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1935,"count":{"hundskatt Män":1,"hundskatt Kvinnor":0,"Totalt":1}},{"year":1936,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1937,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1938,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1939,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1940,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1941,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1942,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1943,"count":{"hundskatt Män":1,"hundskatt Kvinnor":0,"Totalt":1}},{"year":1944,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1945,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1946,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1947,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1948,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1949,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1950,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1951,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1952,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1953,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1954,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1955,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1956,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1957,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1958,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1959,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1960,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1961,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1962,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1963,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1964,"count":{"hundskatt Män":5,"hundskatt Kvinnor":2,"Totalt":7}},{"year":1965,"count":{"hundskatt Män":1,"hundskatt Kvinnor":0,"Totalt":1}},{"year":1966,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1967,"count":{"hundskatt Män":3,"hundskatt Kvinnor":0,"Totalt":3}},{"year":1968,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1969,"count":{"hundskatt Män":0,"hundskatt Kvinnor":1,"Totalt":1}},{"year":1970,"count":{"hundskatt Män":3,"hundskatt Kvinnor":0,"Totalt":3}},{"year":1971,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1972,"count":{"hundskatt Män":1,"hundskatt Kvinnor":0,"Totalt":1}},{"year":1973,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1974,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1975,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1976,"count":{"hundskatt Män":2,"hundskatt Kvinnor":0,"Totalt":2}},{"year":1977,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1978,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1979,"count":{"hundskatt Män":2,"hundskatt Kvinnor":0,"Totalt":2}},{"year":1980,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1981,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1982,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1983,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1984,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1985,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1986,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1987,"count":{"hundskatt Män":5,"hundskatt Kvinnor":0,"Totalt":5}},{"year":1988,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1989,"count":{"hundskatt Män":16,"hundskatt Kvinnor":0,"Totalt":16}},{"year":1990,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1991,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1992,"count":{"hundskatt Män":3,"hundskatt Kvinnor":0,"Totalt":3}},{"year":1993,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1994,"count":{"hundskatt Män":1,"hundskatt Kvinnor":4,"Totalt":5}},{"year":1995,"count":{"hundskatt Män":9,"hundskatt Kvinnor":0,"Totalt":9}},{"year":1996,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1997,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1998,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":1999,"count":{"hundskatt Män":2,"hundskatt Kvinnor":0,"Totalt":2}},{"year":2000,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2001,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2002,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2003,"count":{"hundskatt Män":1,"hundskatt Kvinnor":0,"Totalt":1}},{"year":2004,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2005,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2006,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2007,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2008,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2009,"count":{"hundskatt Män":0,"hundskatt Kvinnor":1,"Totalt":1}},{"year":2010,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2011,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2012,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2013,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2014,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2015,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2016,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2017,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2018,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2019,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2020,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}},{"year":2021,"count":{"hundskatt Män":0,"hundskatt Kvinnor":0,"Totalt":0}}]
        }else{

          try {
            const path = `/tools/word_trends/${search}`;
            const additional_params = { normalize: this.normalizeResults };
            const queryString =
            metaDataStore().getSelectedParams(additional_params);
            const response = await api.get(`${path}?${queryString}`);
            this.wordTrends = response.data.wt_list;
          } catch (error) {
            this.wordTrends = [];
            console.error("Error fetching data:", error);
          }
        }
    },

    async getWordTrendsSpeeches(search) {
      if (search === "hundskatt") {
          this.speechesData = [{"name":"Carl Axel Reuterskiöld","year":1921,"gender":"man","party_abbrev":"partilös","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1921--fk--6_004","link":"https://www.wikidata.org/wiki/Q6068957","formatted_speech_id":"Första kammaren 1921:6 004","node_word":"hundskatt"},{"name":"Mauritz Hellberg","year":1921,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1921--fk--6_011","link":"https://www.wikidata.org/wiki/Q5798883","formatted_speech_id":"Första kammaren 1921:6 011","node_word":"hundskatt"},{"name":"Oscar Osberg","year":1922,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1922--ak--21_065","link":"https://www.wikidata.org/wiki/Q6029940","formatted_speech_id":"Andra kammaren 1922:21 065","node_word":"hundskatt"},{"name":"Erik Röing","year":1922,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1922--ak--21_066","link":"https://www.wikidata.org/wiki/Q6086670","formatted_speech_id":"Andra kammaren 1922:21 066","node_word":"hundskatt"},{"name":"Oscar Osberg","year":1922,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1922--ak--21_068","link":"https://www.wikidata.org/wiki/Q6029940","formatted_speech_id":"Andra kammaren 1922:21 068","node_word":"hundskatt"},{"name":"Algot Sjöström","year":1922,"gender":"man","party_abbrev":"S","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1922--ak--21_069","link":"https://www.wikidata.org/wiki/Q6179105","formatted_speech_id":"Andra kammaren 1922:21 069","node_word":"hundskatt"},{"name":"Erik Röing","year":1922,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1922--ak--21_070","link":"https://www.wikidata.org/wiki/Q6086670","formatted_speech_id":"Andra kammaren 1922:21 070","node_word":"hundskatt"},{"name":"Theodor Gardell","year":1922,"gender":"man","party_abbrev":"C","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1922--ak--21_072","link":"https://www.wikidata.org/wiki/Q5751815","formatted_speech_id":"Andra kammaren 1922:21 072","node_word":"hundskatt"},{"name":"Erik Röing","year":1923,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1923--ak--31_057","link":"https://www.wikidata.org/wiki/Q6086670","formatted_speech_id":"Andra kammaren 1923:31 057","node_word":"hundskatt"},{"name":"Ludwig Brännström","year":1923,"gender":"man","party_abbrev":"M","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1923--ak--31_062","link":"https://www.wikidata.org/wiki/Q5589019","formatted_speech_id":"Andra kammaren 1923:31 062","node_word":"hundskatt"},{"name":"Assar Åkerman","year":1931,"gender":"man","party_abbrev":"S","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1931--fk--35_068","link":"https://www.wikidata.org/wiki/Q6255333","formatted_speech_id":"Första kammaren 1931:35 068","node_word":"hundskatt"},{"name":"Johan Johanson","year":1935,"gender":"man","party_abbrev":"C","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1935--ak--40_026","link":"https://www.wikidata.org/wiki/Q5885074","formatted_speech_id":"Andra kammaren 1935:40 026","node_word":"hundskatt"},{"name":"Erik Norén","year":1943,"gender":"man","party_abbrev":"S","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1943--ak--9_024","link":"https://www.wikidata.org/wiki/Q6016502","formatted_speech_id":"Andra kammaren 1943:9 024","node_word":"hundskatt"},{"name":"Emil Elmvall","year":1964,"gender":"man","party_abbrev":"C","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1964-höst-ak--33_055","link":"https://www.wikidata.org/wiki/Q5710101","formatted_speech_id":"Andra kammaren 1964:33 055","node_word":"hundskatt"},{"name":"Emil Elmvall","year":1964,"gender":"man","party_abbrev":"C","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1964-höst-ak--33_057","link":"https://www.wikidata.org/wiki/Q5710101","formatted_speech_id":"Andra kammaren 1964:33 057","node_word":"hundskatt"},{"name":"Karin Wetterström","year":1964,"gender":"kvinna","party_abbrev":"partilös","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1964-höst-ak--39_034","link":"https://www.wikidata.org/wiki/Q4990401","formatted_speech_id":"Andra kammaren 1964:39 034","node_word":"hundskatt"},{"name":"Emil Elmvall","year":1965,"gender":"man","party_abbrev":"C","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1965--ak--19_085","link":"https://www.wikidata.org/wiki/Q5710101","formatted_speech_id":"Andra kammaren 1965:19 085","node_word":"hundskatt"},{"name":"Bo Skårman","year":1967,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1967--fk--8_090","link":"https://www.wikidata.org/wiki/Q6180594","formatted_speech_id":"Första kammaren 1967:8 090","node_word":"hundskatt"},{"name":"Gunvor Stenberg","year":1969,"gender":"kvinna","party_abbrev":"M","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1969-höst-fk--41_128","link":"https://www.wikidata.org/wiki/Q4980249","formatted_speech_id":"Första kammaren 1969:41 128","node_word":"hundskatt"},{"name":"Erik Boheman","year":1970,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1970--fk--11_021","link":"https://www.wikidata.org/wiki/Q3424655","formatted_speech_id":"Första kammaren 1970:11 021","node_word":"hundskatt"},{"name":"Eskil Tistad","year":1970,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1970-höst-fk--33_005","link":"https://www.wikidata.org/wiki/Q6211635","formatted_speech_id":"Första kammaren 1970:33 005","node_word":"hundskatt"},{"name":"Birger Möller","year":1972,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-1972--106_092","link":"https://www.wikidata.org/wiki/Q6000869","formatted_speech_id":"1972:106 092","node_word":"hundskatt"},{"name":"Per Ahlmark","year":1976,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-197677--117_092","link":"https://www.wikidata.org/wiki/Q1347731","formatted_speech_id":"1976/77:117 092","node_word":"hundskatt"},{"name":"Ingemar Mundebo","year":1976,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-197677--132_030","link":"https://www.wikidata.org/wiki/Q5996964","formatted_speech_id":"1976/77:132 030","node_word":"hundskatt"},{"name":"Thure Jadestig","year":1979,"gender":"man","party_abbrev":"S","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-197980--54_020","link":"https://www.wikidata.org/wiki/Q5826817","formatted_speech_id":"1979/80:54 020","node_word":"hundskatt"},{"name":"Ove Karlsson","year":1987,"gender":"man","party_abbrev":"S","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-198788--3_014","link":"https://www.wikidata.org/wiki/Q5901935","formatted_speech_id":"1987/88:3 014","node_word":"hundskatt"},{"name":"Bengt Westerberg","year":1987,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-198788--61_002","link":"https://www.wikidata.org/wiki/Q817241","formatted_speech_id":"1987/88:61 002","node_word":"hundskatt"},{"name":"Ove Karlsson","year":1987,"gender":"man","party_abbrev":"S","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-198788--7_057","link":"https://www.wikidata.org/wiki/Q5901935","formatted_speech_id":"1987/88:7 057","node_word":"hundskatt"},{"name":"Hugo Hegeland","year":1989,"gender":"man","party_abbrev":"M","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-198990--17_063","link":"https://www.wikidata.org/wiki/Q1635136","formatted_speech_id":"1989/90:17 063","node_word":"hundskatt"},{"name":"Rolf Kenneryd","year":1989,"gender":"man","party_abbrev":"C","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-198990--17_064","link":"https://www.wikidata.org/wiki/Q5906383","formatted_speech_id":"1989/90:17 064","node_word":"hundskatt"},{"name":"Sverre Palm","year":1989,"gender":"man","party_abbrev":"S","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-198990--17_065","link":"https://www.wikidata.org/wiki/Q6033286","formatted_speech_id":"1989/90:17 065","node_word":"hundskatt"},{"name":"Sverre Palm","year":1989,"gender":"man","party_abbrev":"S","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-198990--17_067","link":"https://www.wikidata.org/wiki/Q6033286","formatted_speech_id":"1989/90:17 067","node_word":"hundskatt"},{"name":"Sten Andersson","year":1989,"gender":"man","party_abbrev":"M","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-198990--17_069","link":"https://www.wikidata.org/wiki/Q5556026","formatted_speech_id":"1989/90:17 069","node_word":"hundskatt"},{"name":"Hugo Hegeland","year":1989,"gender":"man","party_abbrev":"M","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-198990--17_070","link":"https://www.wikidata.org/wiki/Q1635136","formatted_speech_id":"1989/90:17 070","node_word":"hundskatt"},{"name":"Sten Andersson","year":1989,"gender":"man","party_abbrev":"M","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-198990--17_071","link":"https://www.wikidata.org/wiki/Q5556026","formatted_speech_id":"1989/90:17 071","node_word":"hundskatt"},{"name":"Alf Wennerfors","year":1992,"gender":"man","party_abbrev":"M","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-199293--117_175","link":"https://www.wikidata.org/wiki/Q6235935","formatted_speech_id":"1992/93:117 175","node_word":"hundskatt"},{"name":"Bo Lundgren","year":1992,"gender":"man","party_abbrev":"M","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-199293--119_286","link":"https://www.wikidata.org/wiki/Q2448370","formatted_speech_id":"1992/93:119 286","node_word":"hundskatt"},{"name":"Lennart Fremling","year":1992,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-199293--119_289","link":"https://www.wikidata.org/wiki/Q5742656","formatted_speech_id":"1992/93:119 289","node_word":"hundskatt"},{"name":"Lennart Fremling","year":1994,"gender":"man","party_abbrev":"L","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-199495--119_121","link":"https://www.wikidata.org/wiki/Q5742656","formatted_speech_id":"1994/95:119 121","node_word":"hundskatt"},{"name":"Sigrid Bolkéus","year":1994,"gender":"kvinna","party_abbrev":"S","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-199495--119_122","link":"https://www.wikidata.org/wiki/Q4939904","formatted_speech_id":"1994/95:119 122","node_word":"hundskatt"},{"name":"Per Rosengren","year":1995,"gender":"man","party_abbrev":"V","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-199596--27_003","link":"https://www.wikidata.org/wiki/Q6079824","formatted_speech_id":"1995/96:27 003","node_word":"hundskatt"},{"name":"Lars U. Granberg","year":1995,"gender":"man","party_abbrev":"S","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-199596--27_004","link":"https://www.wikidata.org/wiki/Q5767954","formatted_speech_id":"1995/96:27 004","node_word":"hundskatt"},{"name":"Per Rosengren","year":1995,"gender":"man","party_abbrev":"V","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-199596--27_005","link":"https://www.wikidata.org/wiki/Q6079824","formatted_speech_id":"1995/96:27 005","node_word":"hundskatt"},{"name":"Sten Andersson","year":1999,"gender":"man","party_abbrev":"M","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-19992000--75_034","link":"https://www.wikidata.org/wiki/Q5556026","formatted_speech_id":"1999/2000:75 034","node_word":"hundskatt"},{"name":"Sven Bergström","year":2003,"gender":"man","party_abbrev":"C","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-200304--84_164","link":"https://www.wikidata.org/wiki/Q5573582","formatted_speech_id":"2003/04:84 164","node_word":"hundskatt"},{"name":"Magdalena Andersson","year":2009,"gender":"kvinna","party_abbrev":"M","speech_link":"https://www.riksdagen.se/sv/sok/?avd=dokument&doktyp=prot","document_name":"prot-200910--94_020","link":"https://www.wikidata.org/wiki/Q4935870","formatted_speech_id":"2009/10:94 020","node_word":"hundskatt"}]

      }else{


        try {
          const path = `/tools/word_trend_speeches/${search}`;
          const queryString = metaDataStore().getSelectedParams();
          const response = await api.get(`${path}?${queryString}`);
          this.speechesData = response.data.speech_list;
        } catch (error) {
          this.speechesData = [];
          console.error("Error fetching data:", error);
        }
      }
    },

    async getWordHits(search) {
      const terms = search.split(",");

      let searchTerm = null;

      for (let term of terms) {
        if (term.includes("*")) {
          searchTerm = term.trim();
          break;
        }
      }
      try {
        const n_hits = -1;

        const path = `/tools/word_trend_hits/${searchTerm}`;
        const queryString = metaDataStore().getSelectedParams();
        const response = await api.get(
          `${path}?${queryString}&n_hits=${n_hits}`
        );
        const newHits = response.data.hit_list.filter(
          (hit) => !this.wordHits.includes(hit)
        );
        this.wordHits = [...this.wordHits, ...newHits].sort();
        this.wordHitsSelected = [
          ...this.wordHitsSelected,
          ...newHits.slice(0, 10),
        ].sort();
        this.searchText = "";
        this.ifAsterisk = true;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    addChip() {
      let text = this.searchText.trim();
      if (text !== "") {
        text = text.split(",").map((word) => word.trim());
        text.forEach((word) => {
          if (!this.wordHitsSelected.includes(word) && !word.includes("*")) {
            this.wordHitsSelected.push(word);
            this.wordHits.push(word);
          }
        });

        this.wordHitsSelected.sort();
        this.wordHits.sort();

        this.searchText = ""; // Reset the search field
      }
    },

    addKWICChip() {
      let text = this.searchText.trim();
      if (text.endsWith("*") && !text.endsWith(".*")) {
        text = `${text.slice(0, -1)}.*`;
      }

      if (text !== "") {
        this.wordHitsSelected.push(text);
        this.wordHits.push(text);

        this.searchText = ""; // Reset the search field
      }
    },

    generateStringOfSelected() {
      this.searchString = [...this.wordHitsSelected];
      this.searchString = this.searchString.join(",");
      return this.searchString;
    },

    downloadCSVcountsWT(selected_metadata) {
      // Get unique words from all word trends
      const uniqueWords = Array.from(
        new Set(this.wordTrends.flatMap((item) => Object.keys(item.count)))
      );
      // Create CSV content
      let csvContent = `year,${uniqueWords.join(",")}\n`;
      this.wordTrends.forEach((item) => {
        const counts = uniqueWords
          .map((word) => item.count[word] || 0)
          .join(",");
        csvContent += `${item.year},${counts}\n`;
      });

      // Create a new instance of JSZip
      const zip = new JSZip();

      // Add the CSV file to the zip
      zip.file("ordtrender.csv", csvContent);

      // Add the file containing the string in selected_metadata to the zip
      zip.file("metadata.txt", selected_metadata);

      // Generate the zip file asynchronously
      zip.generateAsync({ type: "blob" }).then((content) => {
        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(content);
        // Create an anchor element for initiating the download
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.setAttribute("download", "ordtrender.zip");
        anchor.click(); // Trigger the download
        // Revoke the temporary URL after a short delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      });
    },

    async downloadExcelCountsWT(selected_metadata) {
      // Get unique words from all word trends
      const uniqueWords = Array.from(
        new Set(this.wordTrends.flatMap((item) => Object.keys(item.count)))
      );

      // Create an Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // Set the header row
      worksheet.addRow(["year", ...uniqueWords]);

      // Add data rows
      this.wordTrends.forEach((item) => {
        const counts = uniqueWords.map((word) => item.count[word] || 0);
        worksheet.addRow([item.year, ...counts]);
      });

      // Create a buffer to store the workbook data
      const buffer = await workbook.xlsx.writeBuffer();

      // Create a new instance of JSZip
      const zip = new JSZip();

      // Add the Excel file to the zip
      zip.file("data.xlsx", buffer);

      // Add the file containing the string in selected_metadata to the zip
      zip.file("metadata.txt", selected_metadata);

      // Generate the zip file asynchronously
      zip.generateAsync({ type: "blob" }).then((content) => {
        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(content);

        // Create an anchor element for initiating the download
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.setAttribute("download", "wordtrends.zip");
        anchor.click(); // Trigger the download

        // Revoke the temporary URL after a short delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      });
    },
  },
});
