'use client';

import { useState, useEffect } from 'react';

export function useApproach(activeTab: string) {
  const [approachStructure, setApproachStructure] = useState<any[]>([]);
  const [newMainFolder, setNewMainFolder] = useState('');
  const [newSubFolder, setNewSubFolder] = useState('');
  const [newApproachFile, setNewApproachFile] = useState('');
  const [selectedMainFolder, setSelectedMainFolder] = useState('');
  const [selectedSubFolder, setSelectedSubFolder] = useState('');
  const [editingApproachItem, setEditingApproachItem] = useState<any | null>(null);

  const generateId = () => Math.random().toString(36).slice(2);

  const loadApproachStructure = async () => {
    try {
      const res = await fetch('/api/approach/structure');
      if (res.ok) {
        const data = await res.json();
        setApproachStructure(data);
      }
    } catch {}
  };

  useEffect(() => {
    if (activeTab === 'approach') {
      loadApproachStructure();
    }
  }, [activeTab]);

  const updateApproachStructure = async (newStructure: any[]) => {
    try {
      const response = await fetch('/api/approach/structure', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStructure)
      });
      if (response.ok) {
        setApproachStructure(newStructure);
      }
    } catch (error) {
      // Error updating approach structure
    }
  };

  const addMainFolder = async () => {
    if (!newMainFolder.trim()) return;
    const newItem = {
      id: generateId(),
      title: newMainFolder.trim(),
      type: 'folder',
      path: newMainFolder.trim().toLowerCase().replace(/\s+/g, '-'),
      children: []
    };
    const updatedStructure = [...approachStructure, newItem];
    await updateApproachStructure(updatedStructure);
    setNewMainFolder('');
  };

  const addSubFolder = async () => {
    if (!newSubFolder.trim() || !selectedMainFolder) return;
    const newItem = {
      id: generateId(),
      title: newSubFolder.trim(),
      type: 'folder',
      path: `${selectedMainFolder}/${newSubFolder.trim().toLowerCase().replace(/\s+/g, '-')}`,
      children: []
    };
    const updatedStructure = approachStructure.map(item => {
      if (item.id === selectedMainFolder) {
        return { ...item, children: [...(item.children || []), newItem] };
      }
      return item;
    });
    await updateApproachStructure(updatedStructure);
    setNewSubFolder('');
    setSelectedMainFolder('');
  };

  const addApproachFile = async () => {
    if (!newApproachFile.trim() || !selectedSubFolder) return;
    const newItem = {
      id: generateId(),
      title: newApproachFile.trim(),
      type: 'file',
      path: `${selectedSubFolder}/${newApproachFile.trim().toLowerCase().replace(/\s+/g, '-')}`
    };
    const updatedStructure = approachStructure.map(mainFolder => {
      if (mainFolder.children) {
        const updatedChildren = mainFolder.children.map((subFolder: any) => {
          if (subFolder.id === selectedSubFolder) {
            return { ...subFolder, children: [...(subFolder.children || []), newItem] };
          }
          return subFolder;
        });
        return { ...mainFolder, children: updatedChildren };
      }
      return mainFolder;
    });
    await updateApproachStructure(updatedStructure);
    setNewApproachFile('');
    setSelectedSubFolder('');
  };

  const deleteApproachItem = async (itemId: string, parentId?: string, grandParentId?: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    let updatedStructure;
    if (grandParentId) {
      updatedStructure = approachStructure.map(mainFolder => {
        if (mainFolder.id === grandParentId) {
          return {
            ...mainFolder,
            children: mainFolder.children?.map((subFolder: any) => {
              if (subFolder.id === parentId) {
                return { ...subFolder, children: (subFolder.children || []).filter((file: any) => file.id !== itemId) };
              }
              return subFolder;
            })
          };
        }
        return mainFolder;
      });
    } else if (parentId) {
      updatedStructure = approachStructure.map(item => {
        if (item.id === parentId) {
          return { ...item, children: (item.children || []).filter((child: any) => child.id !== itemId) };
        }
        return item;
      });
    } else {
      updatedStructure = approachStructure.filter(item => item.id !== itemId);
    }
    await updateApproachStructure(updatedStructure);
  };

  const moveApproachItem = async (itemId: string, direction: 'up' | 'down', parentId?: string, grandParentId?: string) => {
    let updatedStructure = [...approachStructure];
    if (grandParentId) {
      updatedStructure = updatedStructure.map(mainFolder => {
        if (mainFolder.id === grandParentId) {
          return {
            ...mainFolder,
            children: mainFolder.children.map((subFolder: any) => {
              if (subFolder.id === parentId) {
                const children = [...(subFolder.children || [])];
                const index = children.findIndex((child: any) => child.id === itemId);
                if (index > -1) {
                  if (direction === 'up' && index > 0) { [children[index], children[index - 1]] = [children[index - 1], children[index]]; }
                  else if (direction === 'down' && index < children.length - 1) { [children[index], children[index + 1]] = [children[index + 1], children[index]]; }
                }
                return { ...subFolder, children };
              }
              return subFolder;
            })
          };
        }
        return mainFolder;
      });
    } else if (parentId) {
      updatedStructure = updatedStructure.map(item => {
        if (item.id === parentId) {
          const children = [...(item.children || [])];
          const index = children.findIndex((child: any) => child.id === itemId);
          if (index > -1) {
            if (direction === 'up' && index > 0) { [children[index], children[index - 1]] = [children[index - 1], children[index]]; }
            else if (direction === 'down' && index < children.length - 1) { [children[index], children[index + 1]] = [children[index + 1], children[index]]; }
          }
          return { ...item, children };
        }
        return item;
      });
    } else {
      const index = updatedStructure.findIndex(item => item.id === itemId);
      if (index > -1) {
        if (direction === 'up' && index > 0) { [updatedStructure[index], updatedStructure[index - 1]] = [updatedStructure[index - 1], updatedStructure[index]]; }
        else if (direction === 'down' && index < updatedStructure.length - 1) { [updatedStructure[index], updatedStructure[index + 1]] = [updatedStructure[index + 1], updatedStructure[index]]; }
      }
    }
    await updateApproachStructure(updatedStructure);
  };

  return {
    approachStructure,
    newMainFolder, setNewMainFolder,
    newSubFolder, setNewSubFolder,
    newApproachFile, setNewApproachFile,
    selectedMainFolder, setSelectedMainFolder,
    selectedSubFolder, setSelectedSubFolder,
    editingApproachItem, setEditingApproachItem,
    addMainFolder,
    addSubFolder,
    addApproachFile,
    deleteApproachItem,
    moveApproachItem,
  };
}
