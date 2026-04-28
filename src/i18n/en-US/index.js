// This is just an example,
// so you can safely delete all default props below

export default {
  failed: "Action failed",
  success: "Action was successful",
  kwicFetchError: "Could not load KWIC results.",
  downloadSpeechCsvArchive: "Download CSV archive (.zip)",
  downloadSpeechJsonArchive: "Download JSON archive (.zip)",
  downloadSpeechTextArchive: "Download speeches (.zip)",
  downloadSpeechJsonlGzArchive: "Download speeches (.jsonl.gz)",
  downloadSpeechCsvGzArchive: "Download speeches (.csv.gz)",
  downloadKwicJsonlGzArchive: "Download KWIC (.jsonl.gz)",
  downloadSpeech: "Download speeches",
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
  accessibility: {
    loadingResults: "Loading results, please wait...",
    ticketExpired: "The results have expired. Please submit a new search.",
    kwicTicketTimeout: "The search timed out. Please try again.",
    kwicQueryFailed: "KWIC query failed.",
  },
};
