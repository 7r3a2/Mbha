import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { kvGet, kvSet } from '@/lib/db-utils';

const QUESTIONS_FILE = path.join(process.cwd(), 'data', 'qbank-questions.json');
const KV_KEY = 'qbank-questions';

// Function to parse full CSV text, handling quoted fields, escaped quotes, and newlines inside quoted fields
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentField = '';
  let currentRow: string[] = [];
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

// Function to parse CSV line properly, handling quoted fields with commas
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Function to clean up JSON strings that might have been corrupted by CSV parsing
function cleanJsonString(jsonStr: string): string {
  // Remove outer quotes if present
  let cleaned = jsonStr.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  
  // Fix common CSV parsing issues
  cleaned = cleaned.replace(/\\\"/g, '"'); // Unescape quotes
  cleaned = cleaned.replace(/""/g, '"'); // Fix double quotes
  
  return cleaned;
}

async function readAll() {
  // Prefer KV
  try {
    const kv = await kvGet<any[]>(KV_KEY, null as any);
    if (kv) return kv;
  } catch {}
  // Fallback to file for local dev
  try {
    const raw = await fs.readFile(QUESTIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    return [];
  }
}

async function writeAll(list: any[]) {
  // Write to KV (Postgres)
  try { await kvSet(KV_KEY, list); } catch {}
  // Best-effort write to file (will fail on Vercel, ignore EROFS)
  try {
    await fs.mkdir(path.dirname(QUESTIONS_FILE), { recursive: true });
    await fs.writeFile(QUESTIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e: any) {
    if (e?.code !== 'EROFS') {
      // Ignore read-only filesystem errors on Vercel, rethrow others
      // console.warn('File write skipped:', e?.message);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const subject = formData.get('subject') as string;
    const sourceLabel = (formData.get('sourceLabel') as string) || (formData.get('source') as string) || '';
    const sourceKey = (formData.get('sourceKey') as string) || '';
    const lecture = formData.get('lecture') as string;
    const topic = formData.get('topic') as string;

    if (!file || !subject || !lecture || !topic || (!sourceLabel && !sourceKey)) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        received: { subject, sourceLabel, sourceKey, lecture, topic, hasFile: !!file }
      }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length < 2) {
      return NextResponse.json({ error: 'CSV file must have at least a header and one data row' }, { status: 400 });
    }

    const originalHeaders = rows[0].map((h) => (h || '').trim().replace(/^"|"$/g, ''));
    const headers = originalHeaders.map(h => h.toLowerCase());
    
    // Create mapping from lowercase headers to original headers for data access
    const headerMap: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      headerMap[header] = originalHeaders[index];
    });
    
    // Support multiple formats
    const newFormatHeaders = ['questions', 'options', 'correct_options', 'explanation', 'incorrect_options', 'educational_objective'];
    const userFormatHeaders = ['question', 'options', 'correct_option', 'explanation', 'why the other options are incorrect:', 'educational objective'];
    const simpleFormatHeaders = ['question', 'options', 'correct_option', 'explanation', 'incorrect_reasons', 'educational_objective'];
    const oldWizardHeaders = ['question', 'a', 'b', 'c', 'd', 'answer', 'explanation', 'incorrect_a', 'incorrect_b', 'incorrect_c', 'incorrect_d', 'objective'];
    const oldFormatHeaders = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct', 'explanation', 'objective'];
    
    let formatType = 'unknown';
    let missingHeaders: string[] = [];
    
    // Check which format we're using
    if (headers.includes('questions') && headers.includes('options') && headers.includes('correct_options')) {
      formatType = 'new';
      missingHeaders = newFormatHeaders.filter(h => !headers.includes(h));
    } else if (headers.includes('question') && headers.includes('options') && headers.includes('correct_option') && headers.includes('why the other options are incorrect:')) {
      formatType = 'user';
      missingHeaders = userFormatHeaders.filter(h => !headers.includes(h));
    } else if (headers.includes('question') && headers.includes('options') && headers.includes('correct_option') && headers.includes('incorrect_reasons')) {
      formatType = 'simple';
      missingHeaders = simpleFormatHeaders.filter(h => !headers.includes(h));
    } else if (headers.includes('a') && headers.includes('b') && headers.includes('answer')) {
      formatType = 'wizard';
      missingHeaders = oldWizardHeaders.filter(h => !headers.includes(h));
    } else {
      formatType = 'old';
      missingHeaders = oldFormatHeaders.filter(h => !headers.includes(h));
    }
    
    if (missingHeaders.length > 0) {
      return NextResponse.json({ 
        error: `Missing required headers: ${missingHeaders.join(', ')}`,
        foundHeaders: headers,
        expectedFormat: formatType
      }, { status: 400 });
    }

    const existingQuestions = await readAll();
    const maxId = existingQuestions.reduce((m: number, q: any) => Math.max(m, Number(q.id) || 0), 0);
    const newQuestions = [] as any[];

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].map((v) => (v ?? '').trim());
      if (values.length < headers.length) {
        continue;
      }

      const questionData: any = {};
      originalHeaders.forEach((header, index) => {
        questionData[header] = values[index] || '';
      });

      let options: string[] = [];
      let correctIndex: number = 0;
      let explanation: any = { correct: '', incorrect: [], objective: '' };

      if (formatType === 'new') {
        try {
          options = JSON.parse(questionData.options || '[]');
          const incorrectOptions = JSON.parse(questionData.incorrect_options || '[]');
          if (!Array.isArray(options) || options.length < 2) continue;
          correctIndex = parseInt(questionData.correct_options) - 1;
          explanation = {
            correct: questionData.explanation || '',
            incorrect: Array.isArray(incorrectOptions) ? incorrectOptions : [],
            objective: questionData.educational_objective || ''
          };
        } catch {
          continue;
        }
      } else if (formatType === 'user') {
        try {
          const cleanedOptions = cleanJsonString(questionData.options || '[]');
          options = JSON.parse(cleanedOptions);
          if (!Array.isArray(options) || options.length < 2) continue;
          correctIndex = parseInt(questionData.correct_option) - 1;
          if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) continue;
          // Find the correct header name for the incorrect options field
          const incorrectFieldName = originalHeaders.find(h => h.toLowerCase().includes('why the other options are incorrect')) || 'Why the other options are incorrect:';
          const cleanedIncorrect = cleanJsonString(questionData[incorrectFieldName] || '{}');
          const incorrectData = JSON.parse(cleanedIncorrect);
          const incorrectExplanations = Object.values(incorrectData).filter((val: any) => typeof val === 'string');
          const objectiveFieldName = originalHeaders.find(h => h.toLowerCase().includes('educational objective')) || 'Educational objective';
          explanation = {
            correct: questionData.explanation || '',
            incorrect: incorrectExplanations,
            objective: questionData[objectiveFieldName] || ''
          };
        } catch {
          continue;
        }
      } else if (formatType === 'simple') {
        try {
          options = (questionData.options || '').split('|').filter((opt: string) => opt.trim());
          if (options.length < 2) continue;
          correctIndex = parseInt(questionData.correct_option) - 1;
          if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) continue;
          const incorrectExplanations = (questionData.incorrect_reasons || '').split('|').filter((reason: string) => reason.trim());
          explanation = {
            correct: questionData.explanation || '',
            incorrect: incorrectExplanations,
            objective: questionData.educational_objective || ''
          };
        } catch {
          continue;
        }
      } else if (formatType === 'wizard') {
        options = [questionData.a, questionData.b, questionData.c, questionData.d].filter((opt: string) => opt?.trim());
        correctIndex = parseInt(questionData.answer) - 1;
        const incorrectExplanations = [] as string[];
        if (questionData.incorrect_a) incorrectExplanations.push(questionData.incorrect_a);
        if (questionData.incorrect_b) incorrectExplanations.push(questionData.incorrect_b);
        if (questionData.incorrect_c) incorrectExplanations.push(questionData.incorrect_c);
        if (questionData.incorrect_d) incorrectExplanations.push(questionData.incorrect_d);
        explanation = { correct: questionData.explanation || '', incorrect: incorrectExplanations, objective: questionData.objective || '' };
      } else {
        options = [questionData.option_a, questionData.option_b, questionData.option_c, questionData.option_d].filter((opt: string) => (opt || '').trim());
        correctIndex = parseInt(questionData.correct) - 1;
        explanation = { correct: questionData.explanation || '', incorrect: [], objective: questionData.objective || '' };
      }

      const questionText = formatType === 'new' ? questionData.questions : questionData.question;
      if (!questionText || options.length < 2) continue;
      if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) continue;

      const newQuestion: any = {
        id: maxId + newQuestions.length + 1,
        subject,
        source: sourceLabel,
        sourceKey,
        lecture,
        topic,
        text: questionText,
        options,
        correct: correctIndex,
        explanation
      };
      newQuestions.push(newQuestion);
    }

    if (newQuestions.length === 0) {
      return NextResponse.json({ 
        error: 'No valid questions found in CSV', 
        details: 'All rows were skipped due to parsing errors.',
        format: formatType,
        totalRows: rows.length - 1
      }, { status: 400 });
    }

    const updatedQuestions = [...existingQuestions, ...newQuestions];
    await writeAll(updatedQuestions);

    return NextResponse.json({ 
      message: `Successfully imported ${newQuestions.length} questions`,
      imported: newQuestions.length,
      format: formatType,
      totalRows: rows.length - 1
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to import questions', details: String(error?.message || error) }, { status: 500 });
  }
}
