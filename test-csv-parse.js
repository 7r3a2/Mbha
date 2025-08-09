const fs = require('fs');

// Copy the parseCSV function from the API
function parseCSV(text) {
  const rows = [];
  let currentField = '';
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        // Handle escaped quotes "" inside quoted field
        if (i + 1 < text.length && text[i + 1] === '"') {
          currentField += '"';
          i++; // skip the next quote
        } else {
          inQuotes = false; // closing quote
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true; // opening quote
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        // End of row (handle CRLF and LF)
        // If CRLF, skip the next \n
        if (char === '\r' && i + 1 < text.length && text[i + 1] === '\n') {
          i++;
        }
        // Only push row if it's not an empty trailing newline
        currentRow.push(currentField);
        // Check if row has any non-empty values
        if (currentRow.some((cell) => (cell ?? '').trim() !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Push the last row if present
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((cell) => (cell ?? '').trim() !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Read and test the CSV file
const csvContent = fs.readFileSync('sample-qbank-user-format-fixed.csv', 'utf-8');
console.log('Original CSV content:');
console.log(csvContent);
console.log('\n--- Parsing CSV ---\n');

const rows = parseCSV(csvContent);
console.log('Parsed rows:', rows.length);
rows.forEach((row, index) => {
  console.log(`Row ${index}:`, row.length, 'columns');
  row.forEach((cell, cellIndex) => {
    console.log(`  [${cellIndex}]:`, cell?.substring(0, 100) + (cell?.length > 100 ? '...' : ''));
  });
  console.log('---');
});

// Test headers processing
const originalHeaders = rows[0].map((h) => (h || '').trim().replace(/^"|"$/g, ''));
const headers = originalHeaders.map(h => h.toLowerCase());
console.log('Original headers:', originalHeaders);
console.log('Lowercase headers:', headers);
