'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

interface UniqueCode {
  code: string;
  used: boolean;
  createdAt: string;
  usedBy: string | null;
  usedAt: string | null;
}

export default function AdminCodesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [codes, setCodes] = useState<UniqueCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newCodeCount, setNewCodeCount] = useState(5);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCodes();
    }
  }, [isAuthenticated]);

  const loadCodes = async () => {
    try {
      const response = await fetch('/api/admin/codes');
      if (response.ok) {
        const data = await response.json();
        setCodes(data.codes);
      }
    } catch (error) {
      console.error('Error loading codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewCodes = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/admin/generate-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: newCodeCount }),
      });

      if (response.ok) {
        await loadCodes();
        alert(`Generated ${newCodeCount} new codes successfully!`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate codes');
      }
    } catch (error) {
      console.error('Error generating codes:', error);
      alert('Failed to generate codes');
    } finally {
      setGenerating(false);
    }
  };

  const deleteCode = async (code: string) => {
    if (!confirm('Are you sure you want to delete this code?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/delete-code', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        await loadCodes();
        alert('Code deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete code');
      }
    } catch (error) {
      console.error('Error deleting code:', error);
      alert('Failed to delete code');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage unique registration codes</p>
        </div>

        {/* Generate New Codes */}
        <div className="bg-[#2A2A2A] rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Generate New Codes</h2>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="1"
              max="50"
              value={newCodeCount}
              onChange={(e) => setNewCodeCount(parseInt(e.target.value) || 1)}
              className="bg-[#1E1E1E] text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8431]"
              placeholder="Number of codes"
            />
            <button
              onClick={generateNewCodes}
              disabled={generating}
              className="bg-[#3A8431] text-white px-6 py-2 rounded-lg hover:bg-[#2d6a27] transition-colors duration-300 disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Codes'}
            </button>
          </div>
        </div>

        {/* Codes List */}
        <div className="bg-[#2A2A2A] rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Registration Codes</h2>
          
          {loading ? (
            <div className="text-white text-center py-8">Loading codes...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-white font-semibold py-3 px-4">Code</th>
                    <th className="text-white font-semibold py-3 px-4">Status</th>
                    <th className="text-white font-semibold py-3 px-4">Created</th>
                    <th className="text-white font-semibold py-3 px-4">Used By</th>
                    <th className="text-white font-semibold py-3 px-4">Used At</th>
                    <th className="text-white font-semibold py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((code, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="text-white py-3 px-4 font-mono">{code.code}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          code.used 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {code.used ? 'Used' : 'Available'}
                        </span>
                      </td>
                      <td className="text-gray-300 py-3 px-4">
                        {new Date(code.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-gray-300 py-3 px-4">
                        {code.usedBy || '-'}
                      </td>
                      <td className="text-gray-300 py-3 px-4">
                        {code.usedAt ? new Date(code.usedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteCode(code.code)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">Total Codes</h3>
            <p className="text-3xl font-bold text-[#3A8431]">{codes.length}</p>
          </div>
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">Available Codes</h3>
            <p className="text-3xl font-bold text-green-400">
              {codes.filter(c => !c.used).length}
            </p>
          </div>
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">Used Codes</h3>
            <p className="text-3xl font-bold text-red-400">
              {codes.filter(c => c.used).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 