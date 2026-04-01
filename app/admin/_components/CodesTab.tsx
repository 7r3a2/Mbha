'use client';

interface CodesTabProps {
  uniqueCodes: any[];
  codeFilter: 'all' | 'used' | 'available';
  setCodeFilter: (f: 'all' | 'used' | 'available') => void;
  generateCodes: () => void;
}

export default function CodesTab({ uniqueCodes, codeFilter, setCodeFilter, generateCodes }: CodesTabProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Registration Codes</h3>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setCodeFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${codeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              All ({uniqueCodes.length})
            </button>
            <button
              onClick={() => setCodeFilter('available')}
              className={`px-3 py-1 text-sm rounded-md ${codeFilter === 'available' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Available ({uniqueCodes.filter((code: any) => !code.used).length})
            </button>
            <button
              onClick={() => setCodeFilter('used')}
              className={`px-3 py-1 text-sm rounded-md ${codeFilter === 'used' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Used ({uniqueCodes.filter((code: any) => code.used).length})
            </button>
          </div>
          <button onClick={generateCodes} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Generate Codes
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uniqueCodes
              .filter((code: any) => {
                if (codeFilter === 'all') return true;
                if (codeFilter === 'used') return code.used;
                if (codeFilter === 'available') return !code.used;
                return true;
              })
              .map((code: any) => (
                <tr key={code.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{code.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${code.used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {code.used ? 'Used' : 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{code.usedBy || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {code.usedAt ? new Date(code.usedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {code.createdAt ? new Date(code.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
