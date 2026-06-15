// This is just an example,
// so you can safely delete all default props below

export default {
  failed: "Action failed",
  success: "Action was successful",
  kwicFetchError: "Could not load KWIC results.",
  // downloadSpeechCsvArchive: "Download CSV archive (.zip)",
  // downloadSpeechJsonArchive: "Download JSON archive (.zip)",

  downloadSpeechTextArchive: "Download speeches (.zip)",
  downloadSpeechJsonlGzArchive: "Download speeches (.jsonl.gz)",
  downloadSpeechCsvGzArchive: "Download speeches (.csv.gz)",

  downloadKwicCsvGz: "Download KWIC (.csv.gz)",
  downloadKwicJsonlGz: "Download KWIC (.jsonl.gz)",
  downloadKwicExcel: "Download KWIC (.xlsx)",

  downloadNGramJsonlGz: "Download N-gram (.jsonl.gz)",
  downloadNGramCsvGz: "Download N-gram (.csv.gz)",
  downloadNGramExcel: "Download N-gram (.xlsx)",

  downloadWordTrendsJsonlGz: "Download word trends (.jsonl.gz)",
  downloadWordTrendsCsvGz: "Download word trends (.csv.gz)",
  downloadWordTrendsExcel: "Download word trends (.xlsx)",

  downloadSpeech: "Download speeches",
  searchResultHits: "The search returned {count} hits.",
  searchResultUniqueHits: "The search returned {count} unique hits.",
  downloadFeedback: {
    preparing: "Preparing download...",
    archiveBuilding: "Building archive…",
    archiveBuildingHint:
      "Keep this open to wait, or copy the link and close to fetch later.",
    archiveLinkCopiedClose:
      "Link copied — close to fetch later, or keep waiting here.",
    archiveAborted:
      "Link saved — open it to download the archive when it is ready.",
    success: "The download has started.",
    error: "Could not start the download.",
    archiveGenerationFailed: "Archive generation failed.",
    archiveGenerationTimeout: "Archive generation timed out.",
  },
  downloadRetrievalPage: {
    pending: "Preparing your archive…",
    pendingHint:
      "This page refreshes automatically. You can also bookmark this link and return later.",
    readyTitle: "Your archive is ready",
    readyDescription: "Click the button below to download your archive.",
    expiresAt: "Available until:",
    downloadButton: "Download archive",
    failed: "Archive generation failed",
    expiredTitle: "Link has expired",
    expired:
      "This archive link has expired or is no longer available. Please submit a new search to generate a new archive.",
    backToSearch: "Back to search",
    copyLink: "Copy retrieval link",
    linkCopied: "Link copied!",
  },
  estimateNotInVocabulary: "The word was not found in the vocabulary",
  estimateHitsInfo: "Approx. {hits} estimated hits.",
  kwicEstimateHitsWarning:
    "Approx. {hits} estimated hits - the search may take a while.",
  ngramEstimateHighWarning: "generating n-grams may take a while.",
  ngramsEstimateHitsWarning:
    "The word occurs approximately {hits} times - generating n-grams may take a while.",
  ngramCountApproximate: "approximate",
  accessibility: {
    tooManyRequests: "Too many requests. Please wait a moment before trying again.",
    loadingResults: "Loading results, please wait...",
    ticketExpired: "The results have expired. Please submit a new search.",
    kwicTicketTimeout: "The search timed out. Please try again.",
    kwicQueryFailed: "KWIC query failed.",
    ngramTicketTimeout: "The n-gram search timed out. Please try again.",
    ngramQueryFailed: "N-gram query failed.",
  },
  kwicShardProgress: "{complete} of {total} shards loaded",
  ngramShardProgress: "{complete} of {total} shards loaded",
  searchDropdownOfHitsInfo:
    "The 5 most common words related to the search term with {asterisk} are shown here. There are {count} more words to add to refine the search.",
  wordtrendsResultInfo:
    "The result is shown as a {resultType} for the selected words and metadata.",
  wordtrendsResultSpeechInfo:
    "All {resultType} are shown in a table linked to the selected words and metadata.",
  wordtrendsResultLine: "trend line",
  wordtrendsResultTable: "table",
  wordtrendsResultSpeech: "speeches",
};
