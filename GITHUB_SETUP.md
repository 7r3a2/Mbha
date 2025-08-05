# GitHub Desktop Setup Guide for MBHA Website

This guide will help you move your MBHA website project to GitHub Desktop without including `node_modules` and other unnecessary files.

## Prerequisites

1. **GitHub Desktop** installed on your computer
2. **GitHub account** (create one at github.com if you don't have it)
3. Your project folder ready

## Step-by-Step Instructions

### Step 1: Verify .gitignore is Ready ✅

Your `.gitignore` file is already properly configured to exclude:
- `node_modules/` (dependencies)
- `.next/` (Next.js build files)
- `prisma/dev.db` (database file)
- Environment files (`.env*`)
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Log files and cache

### Step 2: Initialize Git Repository

1. Open **GitHub Desktop**
2. Click **"Add"** → **"Add Existing Repository"**
3. Browse to your project folder: `C:\Users\AL-NABAA\Desktop\mbha-website-v1`
4. Click **"Add Repository"**

### Step 3: Review Files to be Committed

GitHub Desktop will show you all files that will be committed. You should see:
- ✅ All your source code files
- ✅ Configuration files (`package.json`, `tsconfig.json`, etc.)
- ✅ Documentation files (`README.md`, etc.)
- ❌ `node_modules/` (should be excluded)
- ❌ `.next/` (should be excluded)
- ❌ `prisma/dev.db` (should be excluded)

### Step 4: Create Initial Commit

1. In GitHub Desktop, you'll see a list of files to commit
2. Add a commit message: `"Initial commit: MBHA Website v1"`
3. Add a description (optional):
   ```
   Medical education platform with:
   - User authentication system
   - Admin dashboard
   - Question bank with highlighting
   - Exam system
   - Prisma database integration
   ```
4. Click **"Commit to main"**

### Step 5: Publish to GitHub

1. Click **"Publish repository"** in GitHub Desktop
2. Choose repository settings:
   - **Name**: `mbha-website-v1`
   - **Description**: `Medical education platform built with Next.js`
   - **Visibility**: Choose Private (recommended) or Public
3. Click **"Publish Repository"**

### Step 6: Verify Repository

1. Go to your GitHub account in a web browser
2. You should see your new repository: `mbha-website-v1`
3. Verify that `node_modules/` is NOT in the repository
4. Check that all your source code files are present

## Important Notes

### What's Excluded (Good!)
- `node_modules/` - Dependencies (will be installed with `npm install`)
- `.next/` - Build files (generated automatically)
- `prisma/dev.db` - Database file (contains sensitive data)
- `.env*` files - Environment variables (contain secrets)

### What's Included (Correct!)
- All source code files
- `package.json` - Dependencies list
- `prisma/schema.prisma` - Database schema
- Configuration files
- Documentation

## After Publishing

### For Other Developers

When someone clones your repository, they need to:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/mbha-website-v1.git
   cd mbha-website-v1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your settings
   ```

4. **Set up database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the project**:
   ```bash
   npm run dev
   ```

### For You (Future Development)

1. **Make changes** to your code
2. **Commit changes** in GitHub Desktop
3. **Push to GitHub** to sync your changes
4. **Pull changes** if working on multiple computers

## Troubleshooting

### If node_modules appears in GitHub Desktop:
1. Check that `.gitignore` is in the root folder
2. Try refreshing GitHub Desktop
3. If needed, manually remove `node_modules` from the commit list

### If you accidentally committed sensitive files:
1. Remove them from the repository
2. Update `.gitignore` to prevent future commits
3. Consider using `git filter-branch` or `BFG Repo-Cleaner` for sensitive data

## Security Best Practices

1. **Never commit**:
   - `.env` files with secrets
   - Database files with real data
   - API keys or passwords

2. **Always use**:
   - `.env.example` for template files
   - Strong JWT secrets
   - Private repositories for sensitive projects

Your project is now ready for GitHub Desktop! 🚀 