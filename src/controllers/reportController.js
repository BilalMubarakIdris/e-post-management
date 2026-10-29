const Correspondence = require('../models/Correspondence');
const Department = require('../models/Department');
const moment = require('moment');

exports.getReports = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });
    res.render('reports/index', {
      title: 'Reports',
      departments
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error loading reports');
    res.redirect('/dashboard');
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate, department, status } = req.query;
    
    let query = {};
    
    if (type && type !== 'all') {
      query.type = type;
    }
    if (department && department !== 'all') {
      query.department = department;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate + 'T23:59:59');
    }
    
    const correspondence = await Correspondence.find(query)
      .populate('registeredBy', 'fullName')
      .populate('department', 'name')
      .populate('assignedTo', 'fullName')
      .sort({ createdAt: -1 });
    
    const departments = await Department.find({ isActive: true });
    
    res.render('reports/result', {
      title: 'Report Results',
      correspondence,
      departments,
      query: req.query,
      moment
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error generating report');
    res.redirect('/reports');
  }
};
