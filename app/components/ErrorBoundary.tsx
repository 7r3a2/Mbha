'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4">
          <div className="bg-[#2A2A2A] p-6 sm:p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-700">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Something went wrong</h2>
              <p className="text-gray-400 text-sm sm:text-base mb-6">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#3A8431] text-white px-6 py-2.5 rounded-lg hover:bg-[#2d6a27] transition-colors text-sm sm:text-base font-medium"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined });
                    window.location.href = '/';
                  }}
                  className="border border-gray-600 text-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base font-medium"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
