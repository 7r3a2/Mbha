'use client';

interface UsersTabProps {
  users: any[];
  subscriptions: Record<string, { expiresAt: string }>;
  setSubscriptions: (s: Record<string, { expiresAt: string }>) => void;
  grantDuration: Record<string, string>;
  setGrantDuration: (d: Record<string, string>) => void;
  guestCount: number;
  userSearchTerm: string;
  setUserSearchTerm: (s: string) => void;
  setEditingUser: (u: any) => void;
  resetUserPassword: (userId: string, userName: string) => void;
  unlockUserAccount: (userId: string, userName: string) => void;
  deleteUser: (userId: string) => void;
}

export default function UsersTab({
  users, subscriptions, setSubscriptions, grantDuration, setGrantDuration,
  guestCount, userSearchTerm, setUserSearchTerm,
  setEditingUser, resetUserPassword, unlockUserAccount, deleteUser,
}: UsersTabProps) {
  return (
    <>
    {/* User Stats */}
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">Total Users</p>
        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">Registered Users</p>
        <p className="text-2xl font-bold text-blue-600">{users.length}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">Guest Logins</p>
        <p className="text-2xl font-bold text-orange-500">{guestCount}</p>
      </div>
    </div>
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Registered Users</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by email..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {userSearchTerm && (
              <button onClick={() => setUserSearchTerm('')} className="text-gray-500 hover:text-gray-700">Clear</button>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">University</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code Used</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trial / Subscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users
              .filter((user: any) => userSearchTerm === '' || user.email.toLowerCase().includes(userSearchTerm.toLowerCase()))
              .map((user: any) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.gender || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.university || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.uniqueCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        const now = new Date();
                        const created = new Date(user.createdAt);
                        const trialEnds = new Date(created);
                        trialEnds.setDate(trialEnds.getDate() + 3);
                        const trialActive = now < trialEnds;
                        const sub = subscriptions[user.id];
                        const subActive = sub ? now < new Date(sub.expiresAt) : false;
                        const hasFullAccess = trialActive || subActive;
                        if (hasFullAccess) {
                          return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Full Access</span>;
                        } else {
                          return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Basic Access</span>;
                        }
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => setEditingUser(user)} className="text-blue-600 hover:text-blue-900">Edit</button>
                    <button onClick={() => resetUserPassword(user.id, `${user.firstName} ${user.lastName}`)} className="text-green-600 hover:text-green-900">Reset Password</button>
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2">
                      {user.isLocked ? (
                        <span className="bg-red-100 text-red-800 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Locked
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Active
                        </span>
                      )}
                    </div>
                    {user.isLocked && (
                      <button onClick={() => unlockUserAccount(user.id, `${user.firstName} ${user.lastName}`)} className="text-orange-600 hover:text-orange-900">Unlock Account</button>
                    )}
                    <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(() => {
                      const now = new Date();
                      const created = new Date(user.createdAt);
                      const trialEnds = new Date(created);
                      trialEnds.setDate(trialEnds.getDate() + 3);
                      const trialActive = now < trialEnds;
                      const sub = subscriptions[user.id];
                      const subActive = sub ? now < new Date(sub.expiresAt) : false;
                      if (trialActive && !subActive) {
                        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Trial until {trialEnds.toLocaleDateString()}</span>;
                      }
                      if (subActive) {
                        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Subscribed until {new Date(sub.expiresAt).toLocaleDateString()}</span>;
                      }
                      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">No active plan</span>;
                    })()}
                    <div className="mt-2 flex items-center gap-2">
                      <select
                        value={grantDuration[user.id] || ''}
                        onChange={(e) => setGrantDuration({ ...grantDuration, [user.id]: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 text-xs text-black"
                      >
                        <option value="">Grant duration…</option>
                        <option value="1:day">1 day</option>
                        <option value="1:week">1 week</option>
                        <option value="1:month">1 month</option>
                        <option value="6:month">6 months</option>
                        <option value="1:year">1 year</option>
                      </select>
                      <button
                        onClick={async () => {
                          const sel = grantDuration[user.id];
                          if (!sel) return;
                          const [amountStr, unit] = sel.split(':');
                          const amount = parseInt(amountStr, 10);
                          const res = await fetch('/api/admin/subscriptions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: user.id, amount, unit })
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setSubscriptions({ ...subscriptions, [user.id]: { expiresAt: data.expiresAt } });
                            try {
                              const stored = localStorage.getItem('auth_user');
                              if (stored) {
                                const parsed = JSON.parse(stored);
                                if (parsed?.id === user.id) { localStorage.removeItem('auth_user'); }
                              }
                            } catch {}
                          }
                        }}
                        className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      >Grant</button>
                      {(() => {
                        const sub = subscriptions[user.id];
                        const subActive = sub ? new Date() < new Date(sub.expiresAt) : false;
                        if (subActive) {
                          return (
                            <button
                              onClick={async () => {
                                if (!confirm(`Remove subscription for ${user.firstName} ${user.lastName}?`)) return;
                                const res = await fetch(`/api/admin/subscriptions?userId=${user.id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  const newSubs = { ...subscriptions };
                                  delete newSubs[user.id];
                                  setSubscriptions(newSubs);
                                  try {
                                    const stored = localStorage.getItem('auth_user');
                                    if (stored) {
                                      const parsed = JSON.parse(stored);
                                      if (parsed?.id === user.id) { localStorage.removeItem('auth_user'); }
                                    }
                                  } catch {}
                                }
                              }}
                              className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 ml-1"
                            >Remove</button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </td>
                </tr>
              ))}
            {users.filter((user: any) => userSearchTerm === '' || user.email.toLowerCase().includes(userSearchTerm.toLowerCase())).length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  {userSearchTerm ? (
                    <div>
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">No users match the search term "{userSearchTerm}"</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">No users registered</p>
                      <p className="text-sm">No users have registered yet.</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
