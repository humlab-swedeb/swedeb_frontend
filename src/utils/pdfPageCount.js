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
      return pageCountCache.get(url);
    }


    const headResponse = await fetch(url, {
      method: "HEAD",
      mode: "cors", // Explicitly set CORS mode
    });

    if (!headResponse.ok) {
      return await getPageCountFullDownload(url);
    }

    const acceptRanges = headResponse.headers.get("Accept-Ranges");
    const contentLength = headResponse.headers.get("Content-Length");


    // Try range request even if Accept-Ranges header is not exposed via CORS
    // Many servers support it even if they don't expose the header
    if (!contentLength) {
      return await getPageCountFullDownload(url);
    }

    const supportsRanges =
      acceptRanges && acceptRanges.toLowerCase() === "bytes";
    const fileSize = parseInt(contentLength, 10);

    // First, check if this is a linearized PDF by reading the beginning
    // Linearized PDFs have the page count in the first few KB
    const headerSize = 8192;

    try {
      const headerResponse = await fetch(url, {
        headers: {
          Range: `bytes=0-${headerSize - 1}`,
        },
        mode: "cors",
      });

      if (headerResponse.ok) {
        const headerChunk = await headerResponse.arrayBuffer();
        const headerText = new TextDecoder("latin1").decode(headerChunk);

        // Check for linearized PDF marker and /N (page count)
        const linearizedMatch = headerText.match(/\/Linearized\s+1/);
        if (linearizedMatch) {

          const pageCountMatch = headerText.match(/\/N\s+(\d+)/);
          if (pageCountMatch && pageCountMatch[1]) {
            const count = parseInt(pageCountMatch[1], 10);
            if (count > 0 && count < 1000) {
              pageCountCache.set(url, count);
              return count;
            }
          }
        }
      }
    } catch (error) {
      console.log(
        "[getPdfPageCount] Could not check linearized header:",
        error.message
      );
    }

    // If not linearized or /N not found, try progressively larger chunks from the end
    const chunkSizes = [65536, 131072, 262144];

    for (const chunkSize of chunkSizes) {
      const actualChunkSize = Math.min(chunkSize, fileSize);
      const startByte = Math.max(0, fileSize - actualChunkSize);


      const response = await fetch(url, {
        headers: {
          Range: `bytes=${startByte}-${fileSize - 1}`,
        },
        mode: "cors",
      });


      if (!response.ok) {

        // If status is 416 (Range Not Satisfiable), fall back
        if (response.status === 416) {

          return await getPageCountFullDownload(url);
        }

        // For other errors, continue trying
        continue;
      }
      const chunk = await response.arrayBuffer();
      const text = new TextDecoder("latin1").decode(chunk);

      // Look for /Type/Pages and /Count entries in the PDF structure
      const pageCount = extractPageCount(text);

      if (pageCount !== null) {
        // Cache the result
        pageCountCache.set(url, pageCount);
        return pageCount;
      }



      if (actualChunkSize >= fileSize) {
        break;
      }
    }

    return await getPageCountFullDownload(url);
  } catch (error) {
    console.error("[getPdfPageCount] Error:", error.message);
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
      if (count > 0 && count < 1000) {
        return count;
      }
    }
  }


  return null;
}

/**
 * Fallback method: download full PDF and count pages using pdf-lib
 * @param {string} url - The PDF file URL
 * @returns {Promise<number>} - Page count
 */
async function getPageCountFullDownload(url) {

  const { PDFDocument } = await import("pdf-lib");

  const response = await fetch(url, { mode: "cors" });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch PDF: ${response.status} ${response.statusText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();


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
  } else {
    pageCountCache.clear();
  }
}
