const asyncHandler = require('../middleware/async');
const { 
  getAllDepartments, 
  getDepartmentInfo, 
  getDefaultDepartment 
} = require('../utils/departmentMapping');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
exports.getDepartments = asyncHandler(async (req, res) => {
  const departments = getAllDepartments();

  res.status(200).json({
    success: true,
    count: departments.length,
    data: departments
  });
});

// @desc    Get department by code
// @route   GET /api/departments/:code
// @access  Public
exports.getDepartment = asyncHandler(async (req, res) => {
  const department = getDepartmentInfo(req.params.code);

  if (!department) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      code: req.params.code,
      ...department
    }
  });
});

// @desc    Get default department for category
// @route   GET /api/departments/category/:category
// @access  Public
exports.getDefaultDepartmentForCategory = asyncHandler(async (req, res) => {
  const departmentCode = getDefaultDepartment(req.params.category);
  const department = getDepartmentInfo(departmentCode);

  res.status(200).json({
    success: true,
    data: {
      code: departmentCode,
      ...department
    }
  });
});
