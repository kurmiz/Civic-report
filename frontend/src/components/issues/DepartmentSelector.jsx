import React, { useState, useEffect } from 'react';
import { 
  FormControl, 
  FormLabel, 
  Select, 
  Box, 
  Text,
  Spinner,
  Tooltip,
  Icon
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import axios from 'axios';

const DepartmentSelector = ({ selectedCategory, value, onChange, isRequired = true }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch all departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/departments');
        setDepartments(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Get default department when category changes
  useEffect(() => {
    const getDefaultDepartment = async () => {
      if (!selectedCategory) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/departments/category/${selectedCategory}`);
        const defaultDept = response.data.data;
        
        // Only set the default if no department is currently selected
        if (!value) {
          onChange(defaultDept.code);
          setSelectedDepartment(defaultDept);
        } else {
          // Find the selected department in our list
          const dept = departments.find(d => d.code === value);
          setSelectedDepartment(dept);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching default department:', err);
        setError('Failed to load default department');
      } finally {
        setLoading(false);
      }
    };

    getDefaultDepartment();
  }, [selectedCategory, departments, value, onChange]);

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
    <FormControl isRequired={isRequired} mb={4}>
      <FormLabel display="flex" alignItems="center">
        Government Department
        <Tooltip 
          label="Select the appropriate government department that should handle this issue"
          placement="top"
        >
          <Icon as={InfoIcon} ml={1} color="gray.500" />
        </Tooltip>
      </FormLabel>
      
      {loading ? (
        <Spinner size="sm" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <>
          <Select
            placeholder="Select department"
            value={value || ''}
            onChange={handleChange}
          >
            {departments.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.name}
              </option>
            ))}
          </Select>
          
          {selectedDepartment && (
            <Box mt={2} fontSize="sm" color="gray.600">
              <Text>{selectedDepartment.description}</Text>
            </Box>
          )}
        </>
      )}
    </FormControl>
  );
};

export default DepartmentSelector;
