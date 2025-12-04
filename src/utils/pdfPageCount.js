// Cache for storing page counts to avoid re-downloading
const pageCountCache = new Map();

/**
 * Gets the page count of a remote PDF file using minimal data transfer.
 * Uses HTTP range requests to read only the necessary parts of the PDF.
 *
 * @param {string} url - The PDF file URL
 * @returns {Promise<number>} - Page count
 */
export async function getPdfPageCount(url) {
  try {
    // Validate URL
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL provided");
    }

    // Check cache first
    if (pageCountCache.has(url)) {
      console.log("[getPdfPageCount] Returning cached page count for:", url);
      return pageCountCache.get(url);
    }

    console.log("[getPdfPageCount] Fetching page count for:", url);

    // First, check if the server supports range requests
    const headResponse = await fetch(url, {
      method: "HEAD",
      mode: "cors", // Explicitly set CORS mode
    });

    if (!headResponse.ok) {
      console.warn(
        "[getPdfPageCount] HEAD request failed, trying full download"
      );
      return await getPageCountFullDownload(url);
    }

    const acceptRanges = headResponse.headers.get("Accept-Ranges");
    const contentLength = headResponse.headers.get("Content-Length");

    console.log(
      "[getPdfPageCount] Server supports range requests:",
      acceptRanges === "bytes"
    );
    console.log("[getPdfPageCount] Content length:", contentLength);

    if (
      !acceptRanges ||
      acceptRanges.toLowerCase() !== "bytes" ||
      !contentLength
    ) {
      // Server doesn't support range requests
      console.log("[getPdfPageCount] Server doesn't support range requests.");
      console.log(
        "[getPdfPageCount] Note: To improve performance, enable 'Accept-Ranges: bytes' on the PDF server."
      );
      console.log(
        "[getPdfPageCount] Downloading full PDF to get page count..."
      );
      return await getPageCountFullDownload(url);
    }

    const fileSize = parseInt(contentLength, 10);

    // Try progressively larger chunks if needed
    const chunkSizes = [65536, 131072, 262144]; // 64KB, 128KB, 256KB

    for (const chunkSize of chunkSizes) {
      const actualChunkSize = Math.min(chunkSize, fileSize);
      const startByte = Math.max(0, fileSize - actualChunkSize);

      console.log(
        "[getPdfPageCount] Requesting range:",
        `bytes=${startByte}-${fileSize - 1}`,
        `(${actualChunkSize} bytes)`
      );

      const response = await fetch(url, {
        headers: {
          Range: `bytes=${startByte}-${fileSize - 1}`,
        },
        mode: "cors",
      });

      if (!response.ok) {
        console.warn(
          "[getPdfPageCount] Range request failed, trying full download"
        );
        return await getPageCountFullDownload(url);
      }

      const chunk = await response.arrayBuffer();
      const text = new TextDecoder("latin1").decode(chunk);

      // Look for /Type/Pages and /Count entries in the PDF structure
      const pageCount = extractPageCount(text);

      if (pageCount !== null) {
        console.log(
          "[getPdfPageCount] Page count extracted from range:",
          pageCount,
          `(chunk size: ${actualChunkSize} bytes)`
        );
        // Cache the result
        pageCountCache.set(url, pageCount);
        return pageCount;
      }

      console.log(
        `[getPdfPageCount] Could not extract from ${actualChunkSize} bytes, trying larger chunk...`
      );

      // If we've tried the full file, stop
      if (actualChunkSize >= fileSize) {
        break;
      }
    }

    // If we couldn't find the page count in the last chunk, we need the full file
    console.log(
      "[getPdfPageCount] Could not extract page count from range, downloading full file"
    );
    return await getPageCountFullDownload(url);
  } catch (error) {
    console.error("[getPdfPageCount] Error:", error.message);
    console.error("[getPdfPageCount] Full error:", error);
    throw new Error(`Failed to get PDF page count: ${error.message}`);
  }
}

/**
 * Extracts page count from PDF content text
 * @param {string} text - PDF content as text
 * @returns {number|null} - Page count or null if not found
 */
function extractPageCount(text) {
  // Try multiple patterns to find the page count
  const patterns = [
    // Pattern 1: /Type/Pages followed by /Count <number>
    /\/Type\s*\/Pages[^]*?\/Count\s+(\d+)/,
    // Pattern 2: /Count followed by /Type/Pages
    /\/Count\s+(\d+)[^]*?\/Type\s*\/Pages/,
    // Pattern 3: Pages object with Count (more flexible)
    /\/Pages[^]*?\/Count\s+(\d+)/,
    // Pattern 4: Just /Count in the catalog/pages area (last resort)
    /<<[^>]*\/Type\s*\/Pages[^>]*\/Count\s+(\d+)/,
    // Pattern 5: Count with possible object reference
    /\/Count\s+(\d+)(?:\s+0\s+R)?[^]*?\/Type\s*\/Pages/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const count = parseInt(match[1], 10);
      if (count > 0 && count < 100000) {
        // Sanity check
        console.log(
          "[extractPageCount] Found page count using pattern:",
          pattern.source.substring(0, 30) + "..."
        );
        return count;
      }
    }
  }

  console.log("[extractPageCount] Could not find page count in chunk");
  return null;
}

/**
 * Fallback method: download full PDF and count pages using pdf-lib
 * @param {string} url - The PDF file URL
 * @returns {Promise<number>} - Page count
 */
async function getPageCountFullDownload(url) {
  console.log("[getPageCountFullDownload] Downloading full PDF from:", url);

  const { PDFDocument } = await import("pdf-lib");

  const response = await fetch(url, { mode: "cors" });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch PDF: ${response.status} ${response.statusText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  console.log(
    "[getPageCountFullDownload] PDF size:",
    arrayBuffer.byteLength,
    "bytes"
  );

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  console.log("[getPageCountFullDownload] Page count:", pageCount);

  // Cache the result
  pageCountCache.set(url, pageCount);

  return pageCount;
}

/**
 * Clears the page count cache for a specific URL or all URLs
 * @param {string} [url] - Optional URL to clear. If not provided, clears all cache.
 */
export function clearPageCountCache(url) {
  if (url) {
    pageCountCache.delete(url);
    console.log("[clearPageCountCache] Cleared cache for:", url);
  } else {
    pageCountCache.clear();
    console.log("[clearPageCountCache] Cleared all cached page counts");
  }
}
