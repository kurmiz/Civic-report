/**
 * Maps issue categories to their default government departments
 * This helps in suggesting the appropriate department based on the issue category
 */
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

/**
 * Department information with display names and descriptions
 */
const departmentInfo = {
  'public-works': {
    name: 'Public Works Department',
    description: 'Responsible for infrastructure maintenance including roads, bridges, and public facilities.'
  },
  'water-department': {
    name: 'Water Department',
    description: 'Manages water supply, sewage systems, and water-related infrastructure.'
  },
  'sanitation': {
    name: 'Sanitation Department',
    description: 'Handles waste collection, disposal, and recycling services.'
  },
  'parks-recreation': {
    name: 'Parks & Recreation Department',
    description: 'Maintains public parks, recreational facilities, and green spaces.'
  },
  'transportation': {
    name: 'Transportation Department',
    description: 'Oversees public transportation, traffic management, and road safety.'
  },
  'public-safety': {
    name: 'Public Safety Department',
    description: 'Manages emergency services, public safety concerns, and community security.'
  },
  'municipal-services': {
    name: 'Municipal Services',
    description: 'Handles general municipal services and administrative functions.'
  },
  'other': {
    name: 'Other Department',
    description: 'For issues that don\'t fit into the standard categories.'
  }
};

/**
 * Get the default department for a given category
 * @param {string} category - The issue category
 * @returns {string} The default department code
 */
const getDefaultDepartment = (category) => {
  return categoryToDepartmentMap[category] || 'other';
};

/**
 * Get information about a department
 * @param {string} departmentCode - The department code
 * @returns {Object} Department information
 */
const getDepartmentInfo = (departmentCode) => {
  return departmentInfo[departmentCode] || departmentInfo['other'];
};

/**
 * Get all departments as an array of objects
 * @returns {Array} Array of department objects with code, name, and description
 */
const getAllDepartments = () => {
  return Object.keys(departmentInfo).map(code => ({
    code,
    ...departmentInfo[code]
  }));
};

module.exports = {
  categoryToDepartmentMap,
  departmentInfo,
  getDefaultDepartment,
  getDepartmentInfo,
  getAllDepartments
};
