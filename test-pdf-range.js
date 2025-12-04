/**
 * Test script to verify if page count can be extracted from the end of a PDF file
 * This simulates what would happen with HTTP range requests
 */

const fs = require("fs");
const path = require("path");

const pdfPath = path.join(__dirname, "public/pdf/prot-1867--ak--0118.pdf");

// Read the file stats
const stats = fs.statSync(pdfPath);
const fileSize = stats.size;

console.log("PDF File:", pdfPath);
console.log(
  "File Size:",
  fileSize,
  "bytes (",
  (fileSize / 1024 / 1024).toFixed(2),
  "MB)"
);
console.log("");

// Try different chunk sizes from the end
const chunkSizes = [65536, 131072, 262144]; // 64KB, 128KB, 256KB

function extractPageCount(text) {
  const patterns = [
    /\/Type\s*\/Pages[^]*?\/Count\s+(\d+)/,
    /\/Count\s+(\d+)[^]*?\/Type\s*\/Pages/,
    /\/Pages[^]*?\/Count\s+(\d+)/,
    /<<[^>]*\/Type\s*\/Pages[^>]*\/Count\s+(\d+)/,
    /\/Count\s+(\d+)(?:\s+0\s+R)?[^]*?\/Type\s*\/Pages/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const count = parseInt(match[1], 10);
      if (count > 0 && count < 100000) {
        return { count, pattern: pattern.source.substring(0, 40) + "..." };
      }
    }
  }
  return null;
}

for (const chunkSize of chunkSizes) {
  const actualChunkSize = Math.min(chunkSize, fileSize);
  const startByte = Math.max(0, fileSize - actualChunkSize);

  console.log(
    `\n--- Testing with ${(actualChunkSize / 1024).toFixed(
      0
    )}KB chunk from end ---`
  );
  console.log(`Reading bytes ${startByte} to ${fileSize - 1}`);

  // Read the chunk
  const fd = fs.openSync(pdfPath, "r");
  const buffer = Buffer.alloc(actualChunkSize);
  fs.readSync(fd, buffer, 0, actualChunkSize, startByte);
  fs.closeSync(fd);

  // Convert to text (latin1 encoding like in the browser)
  const text = buffer.toString("latin1");

  // Try to extract page count
  const result = extractPageCount(text);

  if (result) {
    console.log("✅ SUCCESS! Found page count:", result.count);
    console.log("   Pattern used:", result.pattern);
    console.log(
      "   Chunk size needed:",
      (actualChunkSize / 1024).toFixed(0) + "KB"
    );

    // Show a snippet of where it was found
    const countMatch = text.match(
      /\/Type\s*\/Pages[^]*?\/Count\s+\d+|\/Count\s+\d+[^]*?\/Type\s*\/Pages/
    );
    if (countMatch) {
      const snippet = countMatch[0].substring(0, 100);
      console.log("   Found in text:", snippet + "...");
    }
    break;
  } else {
    console.log("❌ Page count not found in this chunk");
  }
}

console.log("\n--- Checking PDF structure ---");
// Look for the xref and trailer at the very end
const endChunk = 1024; // Last 1KB
const fd = fs.openSync(pdfPath, "r");
const buffer = Buffer.alloc(endChunk);
fs.readSync(fd, buffer, 0, endChunk, fileSize - endChunk);
fs.closeSync(fd);

const endText = buffer.toString("latin1");

if (endText.includes("%%EOF")) {
  console.log("✅ PDF has proper EOF marker");
}
if (endText.includes("startxref")) {
  const xrefMatch = endText.match(/startxref\s+(\d+)/);
  if (xrefMatch) {
    console.log("✅ Found xref table position:", xrefMatch[1]);
  }
}
if (endText.includes("trailer")) {
  console.log("✅ Found trailer section in last 1KB");
}

console.log("\n--- Conclusion ---");
console.log("If page count was found above, then enabling HTTP range requests");
console.log("on the server WILL allow efficient page count extraction!");
