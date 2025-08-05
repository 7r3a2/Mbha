# Strapi Backend Setup Guide

## Quick Setup

### 1. Create Strapi Project
```bash
npx create-strapi-app@latest strapi-backend --quickstart
cd strapi-backend
```

### 2. Create Content Types

#### Exam Content Type
- **Name**: `exam`
- **Fields**:
  - `title` (Text, required)
  - `questions` (Relation, many-to-one with Question)

#### Question Content Type
- **Name**: `question`
- **Fields**:
  - `text` (Text, required)
  - `exam` (Relation, one-to-many with Exam)
  - `correct_option` (Relation, one-to-one with Option)

#### Option Content Type
- **Name**: `option`
- **Fields**:
  - `text` (Text, required)
  - `question` (Relation, many-to-one with Question)

### 3. Set Permissions
1. Go to Settings → Users & Permissions → Roles
2. Select "Public" role
3. Enable all permissions for Exam, Question, and Option
4. Save

### 4. Create API Token
1. Go to Settings → API Tokens
2. Create new token:
   - **Name**: Import Token
   - **Description**: Token for importing exams
   - **Token duration**: Unlimited
   - **Token type**: Full access
3. Copy the token

### 5. Update Environment Variables
Add to your `.env.local`:
```env
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_token_here
```

### 6. Start Strapi
```bash
npm run develop
```

## Alternative: Use Existing Strapi

If you already have Strapi running elsewhere:
1. Update `STRAPI_URL` to your Strapi URL
2. Get a valid API token from your Strapi admin
3. Update `STRAPI_TOKEN` in `.env.local` 