export const wizaryExamStyles = `
  /* WizaryExam-specific overrides */
  .wizary-exam-page * {
    --wizary-primary: #ff6b35;
    --wizary-secondary: #f7931e;
    --wizary-hover: #e55a2b;
  }

  /* Mobile sidebar forced collapse styles */
  .wizary-exam-page .mobile-sidebar-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .wizary-exam-page button:focus,
  .wizary-exam-page input:focus,
  .wizary-exam-page select:focus {
    outline: none !important;
    border-color: #ff6b35 !important;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2) !important;
  }

  .wizary-exam-page button:hover,
  .wizary-exam-page input:hover,
  .wizary-exam-page select:hover {
    border-color: #ff6b35 !important;
  }

  /* Override any global orange styles for question navigation */
  .wizary-exam-page .bg-gray-200 {
    background-color: #e5e7eb !important;
    border-color: #9ca3af !important;
    color: #1f2937 !important;
  }

  .wizary-exam-page .bg-gray-200:hover {
    background-color: #d1d5db !important;
    border-color: #6b7280 !important;
  }

  .wizary-exam-page .bg-gray-100 {
    background-color: #f3f4f6 !important;
    border-color: #d1d5db !important;
    color: #374151 !important;
  }

  .wizary-exam-page .bg-gray-100:hover {
    background-color: #e5e7eb !important;
    border-color: #9ca3af !important;
  }

  /* Ensure current question stays dark gray */
  .wizary-exam-page .current-question {
    background-color: #6b7280 !important;
    border-color: #4b5563 !important;
    color: #ffffff !important;
  }

  .wizary-exam-page .current-question:hover {
    background-color: #4b5563 !important;
    border-color: #374151 !important;
  }

  /* Override any orange styles for current question */
  .wizary-exam-page .bg-gray-200.current-question {
    background-color: #6b7280 !important;
    border-color: #4b5563 !important;
    color: #ffffff !important;
  }

  .wizary-exam-page .bg-gray-200.current-question:hover {
    background-color: #4b5563 !important;
    border-color: #374151 !important;
  }

  /* Additional specificity to override orange styles */
  .wizary-exam-page button.bg-gray-200.current-question {
    background-color: #6b7280 !important;
    border-color: #4b5563 !important;
    color: #ffffff !important;
  }

  .wizary-exam-page button.bg-gray-200.current-question:hover {
    background-color: #4b5563 !important;
    border-color: #374151 !important;
  }

  /* Maximum specificity to override any orange styles */
  .wizary-exam-page .bg-gray-200.current-question,
  .wizary-exam-page button.bg-gray-200.current-question,
  .wizary-exam-page .current-question.bg-gray-200 {
    background-color: #6b7280 !important;
    border-color: #4b5563 !important;
    color: #ffffff !important;
  }

  .wizary-exam-page .bg-gray-200.current-question:hover,
  .wizary-exam-page button.bg-gray-200.current-question:hover,
  .wizary-exam-page .current-question.bg-gray-200:hover {
    background-color: #4b5563 !important;
    border-color: #374151 !important;
  }

             /* Override any potential orange background */
           .wizary-exam-page .current-question[class*="bg-orange"],
           .wizary-exam-page .current-question[class*="orange"] {
             background-color: #6b7280 !important;
             border-color: #4b5563 !important;
             color: #ffffff !important;
           }

           /* Prevent orange hover on answered questions */
           .wizary-exam-page .bg-green-500:hover {
             background-color: #10b981 !important;
             border-color: #059669 !important;
             color: #ffffff !important;
           }

           /* Ensure answered questions stay green on hover */
           .wizary-exam-page button.bg-green-500:hover {
             background-color: #10b981 !important;
             border-color: #059669 !important;
             color: #ffffff !important;
           }

           /* Override any orange hover effects on green buttons */
           .wizary-exam-page .bg-green-500[class*="hover"] {
             background-color: #10b981 !important;
             border-color: #059669 !important;
             color: #ffffff !important;
           }

           /* Prevent orange stroke on answered questions when clicked */
           .wizary-exam-page .bg-green-500:active,
           .wizary-exam-page .bg-green-500:focus,
           .wizary-exam-page .bg-green-500:focus-visible {
             background-color: #10b981 !important;
             border-color: #059669 !important;
             color: #ffffff !important;
             outline: none !important;
             box-shadow: none !important;
           }

           /* Ensure answered questions never show orange */
           .wizary-exam-page .bg-green-500,
           .wizary-exam-page button.bg-green-500 {
             background-color: #10b981 !important;
             border-color: #059669 !important;
             color: #ffffff !important;
           }

  /* Ensure dark gray for current question with any class combination */
  .wizary-exam-page .current-question,
  .wizary-exam-page .bg-gray-600.current-question,
  .wizary-exam-page button.current-question {
    background-color: #6b7280 !important;
    border-color: #4b5563 !important;
    color: #ffffff !important;
  }

  .wizary-exam-page .current-question:hover,
  .wizary-exam-page .bg-gray-600.current-question:hover,
  .wizary-exam-page button.current-question:hover {
    background-color: #4b5563 !important;
    border-color: #374151 !important;
  }

  /* Mobile question nav slide-down animation */
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-slideDown {
    animation: slideDown 0.25s ease-out;
  }
`;
