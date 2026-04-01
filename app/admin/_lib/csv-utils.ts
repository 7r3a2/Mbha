export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentField = '';
  let currentRow: string[] = [];
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
        if (char === '\r' && i + 1 < text.length && text[i + 1] === '\n') i++;
        currentRow.push(currentField);
        if (currentRow.some((c) => (c ?? '').trim() !== '')) rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((c) => (c ?? '').trim() !== '')) rows.push(currentRow);
  }
  return rows;
}

export function cleanJsonString(jsonStr: string): string {
  let cleaned = (jsonStr || '').trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.slice(1, -1);
  cleaned = cleaned.replace(/\\\"/g, '"').replace(/""/g, '"');
  return cleaned;
}

export interface CsvPreviewResult {
  preview: any[];
  count: number;
  firstQuestion: any | null;
}

export async function previewCsvFile(file: File): Promise<CsvPreviewResult> {
  const text = await file.text();
  const rows = parseCSV(text);

  if (rows.length < 2) {
    return { preview: [], count: 0, firstQuestion: null };
  }

  const headers = rows[0].map(h => (h || '').trim().toLowerCase());

  const isNewFormat = headers.includes('questions') && headers.includes('options') && headers.includes('correct_options');
  const isUserFormat = headers.includes('question') && headers.includes('options') && headers.includes('correct_option') && headers.includes('why the other options are incorrect:');
  const isSimpleFormat = headers.includes('question') && headers.includes('options') && headers.includes('correct_option') && headers.includes('incorrect_reasons');
  const isWizardFormat = headers.includes('a') && headers.includes('b') && headers.includes('answer');

  let requiredHeaders: string[] = [];
  let formatType = 'unknown';

  if (isNewFormat) {
    formatType = 'new';
    requiredHeaders = ['questions', 'options', 'correct_options', 'explanation', 'incorrect_options', 'educational_objective'];
  } else if (isUserFormat) {
    formatType = 'user';
    requiredHeaders = ['question', 'options', 'correct_option', 'explanation', 'why the other options are incorrect:', 'educational objective'];
  } else if (isSimpleFormat) {
    formatType = 'simple';
    requiredHeaders = ['question', 'options', 'correct_option', 'explanation', 'incorrect_reasons', 'educational_objective'];
  } else if (isWizardFormat) {
    formatType = 'wizard';
    requiredHeaders = ['question', 'a', 'b', 'c', 'd', 'answer', 'explanation', 'incorrect_a', 'incorrect_b', 'incorrect_c', 'incorrect_d', 'objective'];
  } else {
    formatType = 'old';
    requiredHeaders = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct', 'explanation', 'objective'];
  }

  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    alert(`Missing required headers: ${missingHeaders.join(', ')}\n\nExpected format: ${formatType}`);
    return { preview: [], count: 0, firstQuestion: null };
  }

  const preview: any[] = [];
  let validCount = 0;
  let firstPreviewQuestion: any | null = null;

  for (let i = 1; i < Math.min(rows.length, 6); i++) {
    const values = rows[i].map(v => (v ?? '').trim());
    if (values.length < headers.length) continue;

    const questionData: any = {};
    headers.forEach((header, index) => { questionData[header] = values[index] || ''; });

    let options: string[] = [];
    let correct: string = '';
    let explanation: string = '';
    let objective: string = '';

    if (formatType === 'new') {
      try {
        options = JSON.parse(questionData.options || '[]');
        correct = questionData.correct_options;
        explanation = questionData.explanation;
        objective = questionData.educational_objective;
      } catch { continue; }
    } else if (formatType === 'user') {
      try {
        options = JSON.parse(cleanJsonString(questionData.options || '[]'));
        correct = questionData.correct_option;
        explanation = questionData.explanation;
        objective = questionData['educational objective'];
      } catch { continue; }
    } else if (formatType === 'simple') {
      options = (questionData.options || '').split('|').filter((opt: string) => opt.trim());
      correct = questionData.correct_option;
      explanation = questionData.explanation;
      objective = questionData.educational_objective;
    } else if (formatType === 'wizard') {
      options = [questionData.a, questionData.b, questionData.c, questionData.d].filter((opt: string) => (opt || '').trim());
      correct = questionData.answer;
      explanation = questionData.explanation;
      objective = questionData.objective;
    } else {
      options = [questionData.option_a, questionData.option_b, questionData.option_c, questionData.option_d].filter((opt: string) => (opt || '').trim());
      correct = questionData.correct;
      explanation = questionData.explanation;
      objective = questionData.objective;
    }

    const questionText = formatType === 'new' ? questionData.questions : questionData.question;
    if (questionText && options.length >= 2) {
      if (i < 6) {
        preview.push({
          question: questionText.substring(0, 50) + '...',
          options: options,
          correct: correct,
          explanation: explanation ? 'Yes' : 'No',
          objective: objective ? 'Yes' : 'No',
          format: formatType
        });
      }
      if (!firstPreviewQuestion) {
        const answerStr = (correct || '').toString().trim().toUpperCase();
        let correctIndex: number;
        if (['A','B','C','D','E'].includes(answerStr)) {
          correctIndex = answerStr.charCodeAt(0) - 65;
        } else {
          const num = parseInt(answerStr);
          correctIndex = formatType === 'wizard' ? num : (num - 1);
        }
        firstPreviewQuestion = {
          id: 1,
          text: questionText,
          options,
          correct: Math.max(0, Math.min(correctIndex, options.length - 1)),
          explanation: { correct: explanation || '', incorrect: [], objective: objective || '' }
        };
      }
      validCount++;
    }
  }

  return { preview, count: validCount, firstQuestion: firstPreviewQuestion };
}
