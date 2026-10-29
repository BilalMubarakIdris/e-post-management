const Correspondence = require('../models/Correspondence');
const User = require('../models/User');
const Department = require('../models/Department');
const Tracking = require('../models/Tracking');
const Notification = require('../models/Notification');

exports.getAll = async (req, res) => {
  try {
    const correspondence = await Correspondence.find()
      .populate('registeredBy', 'fullName')
      .populate('department', 'name')
      .populate('assignedTo', 'fullName')
      .sort({ createdAt: -1 });
    
    res.render('correspondence/index', {
      title: 'All Correspondence',
      correspondence
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching correspondence');
    res.redirect('/dashboard');
  }
};

exports.getAssign = async (req, res) => {
  try {
    const correspondence = await Correspondence.findById(req.params.id);
    const users = await User.find({ isActive: true, role: { $in: ['department_officer', 'registry_officer'] } }).populate('department');
    const departments = await Department.find({ isActive: true });
    
    res.render('correspondence/assign', {
      title: 'Assign Correspondence',
      correspondence,
      users,
      departments
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error loading assignment form');
    res.redirect('/correspondence');
  }
};

exports.postAssign = async (req, res) => {
  try {
    const { assignedTo, department, remarks } = req.body;
    const correspondence = await Correspondence.findById(req.params.id);
    
    if (assignedTo) {
      correspondence.assignedTo = assignedTo;
      correspondence.status = 'assigned';
    }
    if (department) {
      correspondence.department = department;
    }
    
    await correspondence.save();
    
    await Tracking.create({
      correspondence: correspondence._id,
      action: 'assigned',
      fromUser: req.session.userId,
      toUser: assignedTo || null,
      toDepartment: department || null,
      remarks: remarks || 'Correspondence assigned'
    });
    
    if (assignedTo) {
      await Notification.create({
        recipient: assignedTo,
        title: 'Correspondence Assigned',
        message: `Correspondence ${correspondence.trackingNumber} has been assigned to you`,
        type: 'assignment',
        correspondence: correspondence._id,
        link: `/correspondence/view/${correspondence._id}`
      });
    }
    
    req.flash('success_msg', 'Correspondence assigned successfully');
    res.redirect('/correspondence');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error assigning correspondence');
    res.redirect('/correspondence');
  }
};

exports.getForward = async (req, res) => {
  try {
    const correspondence = await Correspondence.findById(req.params.id);
    const users = await User.find({ isActive: true }).populate('department');
    const departments = await Department.find({ isActive: true });
    
    res.render('correspondence/forward', {
      title: 'Forward Correspondence',
      correspondence,
      users,
      departments
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error loading forward form');
    res.redirect('/correspondence');
  }
};

exports.postForward = async (req, res) => {
  try {
    const { toUser, toDepartment, remarks } = req.body;
    const correspondence = await Correspondence.findById(req.params.id);
    
    if (toUser) {
      correspondence.assignedTo = toUser;
    }
    if (toDepartment) {
      correspondence.department = toDepartment;
    }
    correspondence.status = 'forwarded';
    
    await correspondence.save();
    
    await Tracking.create({
      correspondence: correspondence._id,
      action: 'forwarded',
      fromUser: req.session.userId,
      toUser: toUser || null,
      toDepartment: toDepartment || null,
      remarks: remarks || 'Correspondence forwarded'
    });
    
    if (toUser) {
      await Notification.create({
        recipient: toUser,
        title: 'Correspondence Forwarded',
        message: `Correspondence ${correspondence.trackingNumber} has been forwarded to you`,
        type: 'forward',
        correspondence: correspondence._id,
        link: `/correspondence/view/${correspondence._id}`
      });
    }
    
    req.flash('success_msg', 'Correspondence forwarded successfully');
    res.redirect('/correspondence');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error forwarding correspondence');
    res.redirect('/correspondence');
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const correspondence = await Correspondence.findById(req.params.id);
    
    correspondence.status = status;
    if (remarks) {
      correspondence.remarks = remarks;
    }
    
    await correspondence.save();
    
    await Tracking.create({
      correspondence: correspondence._id,
      action: status === 'completed' ? 'completed' : 'in_progress',
      fromUser: req.session.userId,
      remarks: remarks || `Status updated to ${status}`
    });
    
    req.flash('success_msg', 'Status updated successfully');
    res.redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error updating status');
    res.redirect('back');
  }
};

exports.trackByNumber = async (req, res) => {
  try {
    const correspondence = await Correspondence.findOne({ trackingNumber: req.params.trackingNumber })
      .populate('registeredBy', 'fullName')
      .populate('department', 'name')
      .populate('assignedTo', 'fullName');
    
    if (!correspondence) {
      req.flash('error_msg', 'Correspondence not found');
      return res.redirect('/correspondence');
    }
    
    const tracking = await Tracking.find({ correspondence: correspondence._id })
      .populate('fromUser', 'fullName')
      .populate('toUser', 'fullName')
      .populate('toDepartment', 'name')
      .sort({ createdAt: -1 });
    
    res.render('correspondence/track', {
      title: 'Track Correspondence',
      correspondence,
      tracking
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error tracking correspondence');
    res.redirect('/correspondence');
  }
};
