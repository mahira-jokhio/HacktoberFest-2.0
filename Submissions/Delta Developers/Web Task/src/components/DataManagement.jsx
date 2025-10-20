import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Upload, Trash2, AlertCircle } from 'lucide-react';

const DataManagement = () => {
  const { fileStorage, refreshData } = useApp();
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    try {
      fileStorage.exportToFile();
      alert('Data exported successfully!');
    } catch (error) {
      alert('Failed to export data: ' + error.message);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      await fileStorage.importFromFile(file);
      refreshData();
      alert('Data imported successfully!');
    } catch (error) {
      alert('Failed to import data: ' + error.message);
    } finally {
      setImporting(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone!')) {
      if (confirm('This will delete ALL products, sales, employees, customers, and attendance records. Are you absolutely sure?')) {
        fileStorage.clearAllData();
        refreshData();
        alert('All data has been cleared.');
      }
    }
  };

  const getStorageInfo = () => {
    const size = fileStorage.getStorageSize();
    const sizeInKB = (size / 1024).toFixed(2);
    return sizeInKB;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Data Management</h2>
      
      <div className="space-y-4">
        

        {/* Export Data */}
        <div>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            Export Data to File
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Download all your data as a JSON file for backup
          </p>
        </div>

        {/* Import Data */}
        <div>
          <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
            <Upload size={20} />
            {importing ? 'Importing...' : 'Import Data from File'}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Upload a previously exported JSON file to restore data
          </p>
        </div>

        {/* Clear All Data */}
        <div>
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={20} />
            Clear All Data
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Permanently delete all data from the system
          </p>
        </div>
      </div>

     
    </div>
  );
};

export default DataManagement;
