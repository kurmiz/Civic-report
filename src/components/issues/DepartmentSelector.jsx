import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentSelector = ({ selectedCategory, value, onChange, isRequired = true }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Hardcoded departments for now since we don't have the API endpoint yet
  const departmentsList = [
    { code: 'public-works', name: 'Public Works Department', description: 'Responsible for infrastructure maintenance including roads, bridges, and public facilities.' },
    { code: 'water-department', name: 'Water Department', description: 'Manages water supply, sewage systems, and water-related infrastructure.' },
    { code: 'sanitation', name: 'Sanitation Department', description: 'Handles waste collection, disposal, and recycling services.' },
    { code: 'parks-recreation', name: 'Parks & Recreation Department', description: 'Maintains public parks, recreational facilities, and green spaces.' },
    { code: 'transportation', name: 'Transportation Department', description: 'Oversees public transportation, traffic management, and road safety.' },
    { code: 'public-safety', name: 'Public Safety Department', description: 'Manages emergency services, public safety concerns, and community security.' },
    { code: 'municipal-services', name: 'Municipal Services', description: 'Handles general municipal services and administrative functions.' },
    { code: 'other', name: 'Other Department', description: 'For issues that don\'t fit into the standard categories.' }
  ];

  // Category to department mapping
  const categoryToDepartmentMap = {
    'pothole': 'public-works',
    'street-light': 'public-works',
    'water-leak': 'water-department',
    'garbage': 'sanitation',
    'sidewalk': 'public-works',
    'park': 'parks-recreation',
    'safety': 'public-safety',
    'other': 'municipal-services'
  };

  // Set departments on component mount
  useEffect(() => {
    setDepartments(departmentsList);
  }, []);

  // Get default department when category changes
  useEffect(() => {
    if (!selectedCategory) return;
    
    try {
      // Get the default department for the selected category
      const defaultDeptCode = categoryToDepartmentMap[selectedCategory] || 'other';
      
      // Only set the default if no department is currently selected
      if (!value) {
        onChange(defaultDeptCode);
        const dept = departmentsList.find(d => d.code === defaultDeptCode);
        setSelectedDepartment(dept);
      } else {
        // Find the selected department in our list
        const dept = departmentsList.find(d => d.code === value);
        setSelectedDepartment(dept);
      }
    } catch (err) {
      console.error('Error setting default department:', err);
      setError('Failed to set default department');
    }
  }, [selectedCategory, value, onChange]);

  // Update selected department when value changes
  useEffect(() => {
    if (value && departments.length > 0) {
      const dept = departments.find(d => d.code === value);
      setSelectedDepartment(dept);
    }
  }, [value, departments]);

  const handleChange = (e) => {
    const deptCode = e.target.value;
    onChange(deptCode);
    
    const dept = departments.find(d => d.code === deptCode);
    setSelectedDepartment(dept);
  };

  return (
    <div className="mb-4">
      <label className="form-label flex items-center">
        Government Department {isRequired && <span className="text-red-500 ml-1">*</span>}
        <span className="ml-1 text-gray-500 cursor-help" title="Select the appropriate government department that should handle this issue">
          ⓘ
        </span>
      </label>
      
      {loading ? (
        <div className="animate-spin h-5 w-5 border-2 border-primary-500 rounded-full border-t-transparent"></div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <select
            className="input w-full"
            value={value || ''}
            onChange={handleChange}
            required={isRequired}
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.name}
              </option>
            ))}
          </select>
          
          {selectedDepartment && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>{selectedDepartment.description}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DepartmentSelector;
