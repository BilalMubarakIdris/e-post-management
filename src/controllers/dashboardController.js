const Correspondence = require('../models/Correspondence');
const User = require('../models/User');
const Department = require('../models/Department');
const Notification = require('../models/Notification');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    const userRole = req.session.userRole;
    const departmentId = req.session.departmentId;
    
    let query = {};
    if (userRole === 'department_officer') {
      query = { $or: [{ assignedTo: userId }, { department: departmentId }] };
    } else if (userRole === 'registry_officer') {
      query = {}; // can see all
    } else if (userRole === 'management') {
      query = {};
    }
    
    const totalIncoming = await Correspondence.countDocuments({ type: 'incoming' });
    const totalOutgoing = await Correspondence.countDocuments({ type: 'outgoing' });
    const pending = await Correspondence.countDocuments({ status: 'pending' });
    const inProgress = await Correspondence.countDocuments({ status: { $in: ['in_progress', 'assigned', 'forwarded'] } });
    const completed = await Correspondence.countDocuments({ status: 'completed' });
    
    const recentCorrespondence = await Correspondence.find(query)
      .populate('registeredBy', 'fullName')
      .populate('department', 'name')
      .populate('assignedTo', 'fullName')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const notifications = await Notification.find({ recipient: userId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(5);
    
    const totalUsers = userRole === 'admin' ? await User.countDocuments() : 0;
    const totalDepartments = userRole === 'admin' ? await Department.countDocuments() : 0;
    
    res.render('dashboard/index', {
      title: 'Dashboard - E-Post Management System',
      totalIncoming,
      totalOutgoing,
      pending,
      inProgress,
      completed,
      recentCorrespondence,
      notifications,
      totalUsers,
      totalDepartments
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error loading dashboard');
    res.redirect('/auth/login');
  }
};
