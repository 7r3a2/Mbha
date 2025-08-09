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
        if (i + 1 < text.length && text[i + 1] === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && i + 1 < text.length && text[i + 1] === '\n') {
          i++;
        }
        currentRow.push(currentField);
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

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((cell) => (cell ?? '').trim() !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function cleanJsonString(jsonStr) {
  let cleaned = jsonStr.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  cleaned = cleaned.replace(/\\\"/g, '"');
  cleaned = cleaned.replace(/""/g, '"');
  return cleaned;
}

function analyzeCsv(fileName) {
  console.log(`\n=== ANALYZING: ${fileName} ===`);
  
  if (!fs.existsSync(fileName)) {
    console.log(`❌ File ${fileName} not found`);
    return;
  }

  try {
    const csvContent = fs.readFileSync(fileName, 'utf-8');
    console.log(`📄 File size: ${csvContent.length} characters`);
    
    const rows = parseCSV(csvContent);
    console.log(`📊 Parsed ${rows.length} rows`);
    
    if (rows.length === 0) {
      console.log('❌ No rows found');
      return;
    }

    // Check headers
    const originalHeaders = rows[0].map((h) => (h || '').trim().replace(/^"|"$/g, ''));
    const headers = originalHeaders.map(h => h.toLowerCase());
    console.log(`📋 Headers (${headers.length}):`, headers);
    
    // Check expected headers
    const expectedHeaders = ['question', 'options', 'correct_option', 'explanation', 'why the other options are incorrect:', 'educational objective'];
    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      console.log(`❌ Missing headers:`, missingHeaders);
    } else {
      console.log(`✅ All required headers found`);
    }
    
    // Check data rows
    for (let i = 1; i < Math.min(rows.length, 3); i++) {
      const values = rows[i].map((v) => (v ?? '').trim());
      console.log(`\n📝 Row ${i} (${values.length} columns):`);
      
      originalHeaders.forEach((header, index) => {
        const value = values[index] || '';
        console.log(`  ${header}: "${value.substring(0, 100)}${value.length > 100 ? '...' : ''}"`);
        
        // Check JSON fields
        if (header.toLowerCase().includes('options') && value) {
          try {
            const cleaned = cleanJsonString(value);
            const parsed = JSON.parse(cleaned);
            console.log(`    ✅ Valid JSON array with ${parsed.length} options`);
          } catch (e) {
            console.log(`    ❌ Invalid JSON: ${e.message}`);
          }
        }
        
        if (header.toLowerCase().includes('why the other options are incorrect') && value) {
          try {
            const cleaned = cleanJsonString(value);
            const parsed = JSON.parse(cleaned);
            console.log(`    ✅ Valid JSON object with ${Object.keys(parsed).length} explanations`);
          } catch (e) {
            console.log(`    ❌ Invalid JSON: ${e.message}`);
          }
        }
      });
    }
    
  } catch (error) {
    console.log(`❌ Error reading file: ${error.message}`);
  }
}

// Analyze different CSV files
const csvFiles = [
  'source 1.csv',  // Working file
  'source2.csv'     // Non-working file (renamed from Arabic)
];

csvFiles.forEach(analyzeCsv);

console.log('\n=== INSTRUCTIONS ===');
console.log('1. Copy your "source 1.csv" (working) file to this folder');
console.log('2. Copy your non-working CSV files to this folder'); 
console.log('3. Add their names to the csvFiles array above');
console.log('4. Run this script again: node debug-csv.js');
