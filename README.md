# MBHA Website v1

A comprehensive medical education platform built with Next.js, featuring exam management, question banks, and user authentication.

## Features

- **User Authentication**: Secure login/signup with "Remember Me" functionality
- **Admin Dashboard**: Complete user and exam management system
- **Question Bank**: Interactive study tool with highlighting capabilities
- **Exam System**: Timed exams with scoring and review features
- **Database**: Prisma ORM with SQLite for data persistence

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with SQLite
- **Authentication**: Custom JWT-based auth system
- **State Management**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mbha-website-v1
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
mbha-website-v1/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication pages
│   ├── qbank/             # Question bank
│   └── quiz/              # Exam system
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

## Database

This project uses Prisma with SQLite. The database file (`prisma/dev.db`) is excluded from version control.

To reset the database:
```bash
npx prisma db push --force-reset
```

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.
