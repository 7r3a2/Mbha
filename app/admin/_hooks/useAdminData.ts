'use client';

import { useState, useEffect } from 'react';

export function useAdminData(user: any, isLoading: boolean) {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, { expiresAt: string }>>({});
  const [grantDuration, setGrantDuration] = useState<Record<string, string>>({});
  const [exams, setExams] = useState([]);
  const [uniqueCodes, setUniqueCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [codeFilter, setCodeFilter] = useState<'all' | 'used' | 'available'>('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [guestCount, setGuestCount] = useState(0);
  const [activeTab, setActiveTab] = useState('users');

  const loadData = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      const [usersRes, examsRes, codesRes] = await Promise.all([
        fetch(`/api/admin/users?t=${timestamp}`),
        fetch(`/api/admin/exams?t=${timestamp}`),
        fetch(`/api/admin/codes?t=${timestamp}`)
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      if (examsRes.ok) {
        const examsData = await examsRes.json();
        setExams(examsData);
      }
      if (codesRes.ok) {
        const codesData = await codesRes.json();
        setUniqueCodes(codesData);
      }
    } catch (error) {
      // Error loading admin data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && user?.uniqueCode?.startsWith('ADMIN')) {
      loadData();
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetch('/api/admin/subscriptions')
        .then((r) => (r.ok ? r.json() : {}))
        .then((data) => setSubscriptions(data || {}))
        .catch(() => {});
      fetch('/api/admin/guest-count')
        .then((r) => (r.ok ? r.json() : { count: 0 }))
        .then((data) => setGuestCount(data.count || 0))
        .catch(() => {});
    }
  }, [activeTab]);

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(users.filter((u: any) => u.id !== userId));
      }
    } catch (error) {
      // Error deleting user
    }
  };

  const deleteExam = async (examId: string, examTitle: string = '') => {
    if (!confirm(`Are you sure you want to delete "${examTitle}"? This action cannot be undone.`)) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/exams/${examId}`, { method: 'DELETE' });
      if (response.ok) {
        await loadData();
        setMessage(`✅ Exam "${examTitle}" deleted successfully!`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(`❌ Failed to delete exam: ${errorData.error || 'Unknown error'}`);
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      setError('❌ Network error while deleting exam. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const generateCodes = async () => {
    const count = prompt('How many codes to generate? (1-100)');
    if (!count || isNaN(Number(count)) || Number(count) < 1 || Number(count) > 100) {
      alert('Please enter a valid number between 1 and 100');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/admin/generate-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: Number(count) })
      });
      if (response.ok) {
        const result = await response.json();
        alert(`✅ Successfully generated ${result.codes?.length || result.count || count} new registration codes!`);
        await loadData();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          alert(`❌ Error: ${errorJson.error}`);
        } catch {
          alert(`❌ Error: ${errorText || 'Failed to generate codes'}`);
        }
      }
    } catch (error) {
      alert('❌ Network error. Please check if server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (userId: string, userData: any) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        loadData();
        setEditingUser(null);
        alert('User updated successfully!');
      }
    } catch (error) {
      alert('Error updating user');
    }
  };

  const updateExamInfo = async (examId: string, examData: any) => {
    try {
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
      });
      if (response.ok) {
        await loadData();
        setEditingExam(null);
        alert('Exam updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Error updating exam: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error updating exam');
    }
  };

  const resetUserPassword = async (userId: string, userName: string) => {
    const newPassword = prompt(`Enter new password for ${userName}:`);
    if (!newPassword) return;
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    if (!confirm(`Are you sure you want to reset password for ${userName}?`)) return;
    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword })
      });
      if (response.ok) {
        alert('✅ Password reset successfully!');
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.error}`);
      }
    } catch (error) {
      alert('❌ Failed to reset password. Please try again.');
    }
  };

  const unlockUserAccount = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to unlock account for ${userName}?`)) return;
    try {
      const response = await fetch('/api/admin/users/unlock-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (response.ok) {
        alert('✅ Account unlocked successfully!');
        loadData();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.error}`);
      }
    } catch (error) {
      alert('❌ Failed to unlock account. Please try again.');
    }
  };

  return {
    users, setUsers,
    subscriptions, setSubscriptions,
    grantDuration, setGrantDuration,
    exams, setExams,
    uniqueCodes, setUniqueCodes,
    loading, setLoading,
    editingUser, setEditingUser,
    editingExam, setEditingExam,
    userSearchTerm, setUserSearchTerm,
    codeFilter, setCodeFilter,
    message, setMessage,
    error, setError,
    guestCount,
    activeTab, setActiveTab,
    loadData,
    deleteUser,
    deleteExam,
    generateCodes,
    updateUserInfo,
    updateExamInfo,
    resetUserPassword,
    unlockUserAccount,
  };
}
