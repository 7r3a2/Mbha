import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-[#3A8431] mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm sm:text-base">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#3A8431] text-white px-6 py-2.5 rounded-lg hover:bg-[#2d6a27] transition-colors font-medium text-sm sm:text-base"
          >
            Go Home
          </Link>
          <Link
            href="/login"
            className="border border-gray-600 text-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
