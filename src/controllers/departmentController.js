const Department = require('../models/Department');

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.render('departments/index', {
      title: 'Manage Departments',
      departments
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching departments');
    res.redirect('/dashboard');
  }
};

exports.getAddDepartment = (req, res) => {
  res.render('departments/add', {
    title: 'Add Department'
  });
};

exports.postAddDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    const existingDept = await Department.findOne({ $or: [{ name }, { code: code.toUpperCase() }] });
    if (existingDept) {
      req.flash('error_msg', 'Department name or code already exists');
      return res.redirect('/departments/add');
    }
    
    await Department.create({
      name,
      code: code.toUpperCase(),
      description
    });
    
    req.flash('success_msg', 'Department created successfully');
    res.redirect('/departments');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error creating department');
    res.redirect('/departments/add');
  }
};

exports.getEditDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    res.render('departments/edit', {
      title: 'Edit Department',
      department
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching department');
    res.redirect('/departments');
  }
};

exports.putEditDepartment = async (req, res) => {
  try {
    const { name, code, description, isActive } = req.body;
    
    await Department.findByIdAndUpdate(req.params.id, {
      name,
      code: code.toUpperCase(),
      description,
      isActive: isActive === 'on'
    });
    
    req.flash('success_msg', 'Department updated successfully');
    res.redirect('/departments');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error updating department');
    res.redirect('/departments');
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Department deleted successfully');
    res.redirect('/departments');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error deleting department');
    res.redirect('/departments');
  }
};
