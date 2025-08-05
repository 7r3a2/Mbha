# Exam Import System

## Overview
This system allows you to import exams from CSV files into your Strapi backend. The import process creates exams, questions, and options automatically.

## Files Created

### 1. API Route
- **Location**: `app/api/import-exam/route.ts`
- **Purpose**: Handles the import process and communicates with Strapi

### 2. Import Page
- **Location**: `app/import-exam/page.tsx`
- **Purpose**: Provides a user interface for uploading CSV files

### 3. Sample Files
- **env.example**: Template for environment variables
- **sample-exam.csv**: Example CSV file for testing

## Setup Instructions

### 1. Environment Variables
Copy `env.example` to `.env.local` and update the values:

```bash
cp env.example .env.local
```

Edit `.env.local`:
```env
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_strapi_api_token_here
```

### 2. Strapi Setup
Make sure your Strapi backend has the following content types:

#### Exam Content Type
- `title` (Text)

#### Question Content Type
- `text` (Text)
- `exam` (Relation to Exam)
- `correct_option` (Relation to Option)

#### Option Content Type
- `text` (Text)
- `question` (Relation to Question)

### 3. Get Strapi API Token
1. Go to Strapi Admin Panel
2. Navigate to Settings → API Tokens
3. Create a new token with appropriate permissions
4. Copy the token to your `.env.local` file

## CSV Format

Your CSV file must have the following columns:

| Column | Description | Required |
|--------|-------------|----------|
| `question` | Question text | Yes |
| `option_a` | First option | Yes |
| `option_b` | Second option | Yes |
| `option_c` | Third option | Yes |
| `option_d` | Fourth option | Yes |
| `option_e` | Fifth option | No |
| `correct_option` | Correct answer (1-5) | Yes |

### Example CSV:
```csv
question,option_a,option_b,option_c,option_d,option_e,correct_option
"What is the diagnosis?","Answer A","Answer B","Answer C","Answer D","Answer E",3
```

## Usage

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Start your Strapi backend:
   ```bash
   cd backend/strapibackend
   npm run develop
   ```

3. Navigate to `/import-exam` in your browser

4. Enter the exam title

5. Upload your CSV file

6. Review the preview

7. Click "رفع الامتحان" to import

## Features

- ✅ CSV file validation
- ✅ Data preview before import
- ✅ Error handling
- ✅ Loading states
- ✅ Arabic interface
- ✅ Responsive design
- ✅ Automatic exam, question, and option creation

## Troubleshooting

### Common Issues:

1. **"Missing STRAPI_TOKEN or STRAPI_URL"**
   - Check your `.env.local` file
   - Make sure the file is in the root directory
   - Restart your development server

2. **"Failed to create exam"**
   - Check your Strapi API token permissions
   - Ensure Strapi is running
   - Verify the content types exist

3. **CSV parsing errors**
   - Check the CSV format
   - Ensure all required columns are present
   - Verify the correct_option values are 1-5

### Debug Mode:
To see detailed error messages, check the browser console and server logs.

## Sample Data

Use the provided `sample-exam.csv` file to test the import functionality. This file contains 5 sample questions related to Obstetric & Gynecology. 