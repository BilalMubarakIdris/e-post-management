const User = require('../models/User');
const Department = require('../models/Department');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('department').sort({ createdAt: -1 });
    res.render('users/index', {
      title: 'Manage Users',
      users
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching users');
    res.redirect('/dashboard');
  }
};

exports.getAddUser = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });
    res.render('users/add', {
      title: 'Add User',
      departments
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error loading form');
    res.redirect('/users');
  }
};

exports.postAddUser = async (req, res) => {
  try {
    const { fullName, username, email, password, role, department, phone } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] });
    if (existingUser) {
      req.flash('error_msg', 'Username or email already exists');
      return res.redirect('/users/add');
    }
    
    await User.create({
      fullName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role,
      department: department || null,
      phone
    });
    
    req.flash('success_msg', 'User created successfully');
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error creating user');
    res.redirect('/users/add');
  }
};

exports.getEditUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('department');
    const departments = await Department.find({ isActive: true });
    res.render('users/edit', {
      title: 'Edit User',
      user,
      departments
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching user');
    res.redirect('/users');
  }
};

exports.putEditUser = async (req, res) => {
  try {
    const { fullName, email, role, department, phone, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/users');
    }
    
    user.fullName = fullName;
    user.email = email.toLowerCase();
    user.role = role;
    user.department = department || null;
    user.phone = phone;
    user.isActive = isActive === 'on';
    
    if (req.body.password && req.body.password.trim() !== '') {
      user.password = req.body.password;
    }
    
    await user.save();
    
    req.flash('success_msg', 'User updated successfully');
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error updating user');
    res.redirect('/users');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'User deleted successfully');
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error deleting user');
    res.redirect('/users');
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    req.flash('success_msg', `User ${user.isActive ? 'activated' : 'deactivated'} successfully`);
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error updating user status');
    res.redirect('/users');
  }
};
