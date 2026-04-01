'use client';

interface ApproachTabProps {
  approachStructure: any[];
  newMainFolder: string;
  setNewMainFolder: (s: string) => void;
  newSubFolder: string;
  setNewSubFolder: (s: string) => void;
  newApproachFile: string;
  setNewApproachFile: (s: string) => void;
  selectedMainFolder: string;
  setSelectedMainFolder: (s: string) => void;
  selectedSubFolder: string;
  setSelectedSubFolder: (s: string) => void;
  addMainFolder: () => void;
  addSubFolder: () => void;
  addApproachFile: () => void;
  deleteApproachItem: (itemId: string, parentId?: string, grandParentId?: string) => void;
  moveApproachItem: (itemId: string, direction: 'up' | 'down', parentId?: string, grandParentId?: string) => void;
}

export default function ApproachTab({
  approachStructure, newMainFolder, setNewMainFolder, newSubFolder, setNewSubFolder,
  newApproachFile, setNewApproachFile, selectedMainFolder, setSelectedMainFolder,
  selectedSubFolder, setSelectedSubFolder, addMainFolder, addSubFolder, addApproachFile,
  deleteApproachItem, moveApproachItem,
}: ApproachTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approach Management</h3>

        {/* Section 1: Add Structure */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">1. Add Structure</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Add Main Folder */}
            <div className="border rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-2">Add Main Folder</h5>
              <div className="space-y-2">
                <input type="text" placeholder="e.g., Internal Medicine" value={newMainFolder}
                  onChange={(e) => setNewMainFolder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
                <button onClick={addMainFolder} disabled={!newMainFolder.trim()}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Add Main Folder</button>
              </div>
            </div>

            {/* Add Sub Folder */}
            <div className="border rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-2">Add Sub Folder</h5>
              <div className="space-y-2">
                <select value={selectedMainFolder || ''} onChange={(e) => setSelectedMainFolder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                  <option value="">Select Main Folder</option>
                  {approachStructure.map((folder: any) => (
                    <option key={folder.id} value={folder.id}>{folder.title}</option>
                  ))}
                </select>
                <input type="text" placeholder="e.g., Cardiology" value={newSubFolder}
                  onChange={(e) => setNewSubFolder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
                <button onClick={addSubFolder} disabled={!selectedMainFolder || !newSubFolder.trim()}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">Add Sub Folder</button>
              </div>
            </div>

            {/* Add File */}
            <div className="border rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-2">Add File</h5>
              <div className="space-y-2">
                <select value={selectedSubFolder || ''} onChange={(e) => setSelectedSubFolder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                  <option value="">Select Sub Folder</option>
                  {approachStructure.map((mainFolder: any) =>
                    mainFolder.children?.map((subFolder: any) => (
                      <option key={subFolder.id} value={subFolder.id}>{mainFolder.title} → {subFolder.title}</option>
                    ))
                  ).flat() || []}
                </select>
                <input type="text" placeholder="e.g., Chest Pain" value={newApproachFile}
                  onChange={(e) => setNewApproachFile(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
                <button onClick={addApproachFile} disabled={!selectedSubFolder || !newApproachFile.trim()}
                  className="w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50">Add File</button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Manage Structure */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">2. Manage Structure</h4>
          <div className="space-y-4">
            {approachStructure.map((mainFolder: any, mainIndex: number) => (
              <div key={mainFolder.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📁</span>
                    <h5 className="font-medium text-gray-800">{mainFolder.title}</h5>
                    <span className="text-sm text-gray-500">({mainFolder.children?.length || 0} sub-folders)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveApproachItem(mainFolder.id, 'up')} disabled={mainIndex === 0}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50">↑</button>
                    <button onClick={() => moveApproachItem(mainFolder.id, 'down')} disabled={mainIndex === approachStructure.length - 1}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50">↓</button>
                    <button onClick={() => deleteApproachItem(mainFolder.id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                  </div>
                </div>

                {mainFolder.children && mainFolder.children.length > 0 && (
                  <div className="ml-6 space-y-3">
                    {mainFolder.children.map((subFolder: any, subIndex: number) => (
                      <div key={subFolder.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-md">📂</span>
                            <h6 className="font-medium text-gray-700">{subFolder.title}</h6>
                            <span className="text-xs text-gray-500">({subFolder.children?.length || 0} files)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => moveApproachItem(subFolder.id, 'up', mainFolder.id)} disabled={subIndex === 0}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50">↑</button>
                            <button onClick={() => moveApproachItem(subFolder.id, 'down', mainFolder.id)} disabled={subIndex === mainFolder.children.length - 1}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50">↓</button>
                            <button onClick={() => deleteApproachItem(subFolder.id, mainFolder.id)}
                              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                          </div>
                        </div>

                        {subFolder.children && subFolder.children.length > 0 && (
                          <div className="ml-6 space-y-1">
                            {subFolder.children.map((file: any, fileIndex: number) => (
                              <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">📄</span>
                                  <div className="font-medium text-gray-700">{file.title}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => moveApproachItem(file.id, 'up', subFolder.id, mainFolder.id)} disabled={fileIndex === 0}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50">↑</button>
                                  <button onClick={() => moveApproachItem(file.id, 'down', subFolder.id, mainFolder.id)} disabled={fileIndex === subFolder.children.length - 1}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50">↓</button>
                                  <button onClick={() => deleteApproachItem(file.id, subFolder.id, mainFolder.id)}
                                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
