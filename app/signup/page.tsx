'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, useValidateCode } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();
  const validateCodeMutation = useValidateCode();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    university: '',

    uniqueCode: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const universities = [
    'University of Baghdad',
    'University of Baghdad – Al-Kindy',
    'Al-Mustansiriya University',
    'Al-Nahrain University',
    'Al-Iraqia University',
    'Ibn Sina University for Medical and Pharmaceutical Sciences',
    'University of Basrah',
    'University of Mosul',
    'University of Anbar',
    'University of Thi‑Qar',
    'University of Misan',
    'University of Wasit',
    'University of Kerbala',
    'University of Kufa',
    'University of Babylon',
    'University of Diyala',
    'University of Tikrit',
    'University of Kirkuk'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.university) {
      newErrors.university = 'Please select your university';
    }
    
    if (!formData.uniqueCode.trim()) {
      newErrors.uniqueCode = 'Registration code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Register user
        await register(formData);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error: any) {
        setErrors({ submit: error.message || 'Registration failed' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 flex items-center justify-center shadow-lg">
              <Image 
                src="/images/logo lander.png" 
                alt="MedAce Logo" 
                width={64} 
                height={64} 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join MedAce and start your medical journey</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`appearance-none relative block w-full px-3 py-4 border rounded-xl text-white placeholder-gray-400 bg-[#2A2A2A] border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b1319] focus:border-transparent transition-all duration-300 ${
                errors.firstName ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`appearance-none relative block w-full px-3 py-4 border rounded-xl text-white placeholder-gray-400 bg-[#2A2A2A] border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b1319] focus:border-transparent transition-all duration-300 ${
                errors.lastName ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`appearance-none relative block w-full px-3 py-4 border rounded-xl text-white placeholder-gray-400 bg-[#2A2A2A] border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b1319] focus:border-transparent transition-all duration-300 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`appearance-none relative block w-full px-3 py-4 pr-10 border rounded-xl text-white placeholder-gray-400 bg-[#2A2A2A] border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b1319] focus:border-transparent transition-all duration-300 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="appearance-none relative block w-full px-3 py-4 border rounded-xl text-white bg-[#2A2A2A] border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b1319] focus:border-transparent transition-all duration-300"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* University */}
          <div>
            <label htmlFor="university" className="block text-sm font-medium text-gray-300 mb-2">
              University
            </label>
            <select
              id="university"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              className={`appearance-none relative block w-full px-3 py-4 border rounded-xl text-white bg-[#2A2A2A] border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b1319] focus:border-transparent transition-all duration-300 ${
                errors.university ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            >
              <option value="">Select your university</option>
              {universities.map((university, index) => (
                <option key={index} value={university}>
                  {university}
                </option>
              ))}
            </select>
            {errors.university && (
              <p className="mt-1 text-sm text-red-400">{errors.university}</p>
            )}
          </div>



          {/* Registration Code */}
          <div>
            <label htmlFor="uniqueCode" className="block text-sm font-medium text-gray-300 mb-2">
              Registration Code
            </label>
            <input
              id="uniqueCode"
              name="uniqueCode"
              type="text"
              value={formData.uniqueCode}
              onChange={handleInputChange}
              className={`appearance-none relative block w-full px-3 py-4 border rounded-xl text-white placeholder-gray-400 bg-[#2A2A2A] border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b1319] focus:border-transparent transition-all duration-300 ${
                errors.uniqueCode ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Enter your registration code"
            />
            {errors.uniqueCode && (
              <p className="mt-1 text-sm text-red-400">{errors.uniqueCode}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-[#8b1319] to-[#6a0f14] hover:from-[#6a0f14] hover:to-[#4a0b0e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b1319] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              <p className="text-sm">{errors.submit}</p>
            </div>
          )}
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#8b1319] hover:text-[#6a0f14] transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}