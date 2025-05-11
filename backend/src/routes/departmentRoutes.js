const express = require('express');
const {
  getDepartments,
  getDepartment,
  getDefaultDepartmentForCategory
} = require('../controllers/departmentController');

const router = express.Router();

router.route('/').get(getDepartments);
router.route('/:code').get(getDepartment);
router.route('/category/:category').get(getDefaultDepartmentForCategory);

module.exports = router;
