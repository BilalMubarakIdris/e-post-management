const Correspondence = require('../models/Correspondence');
const Department = require('../models/Department');
const Tracking = require('../models/Tracking');
const generateTrackingNumber = require('../utils/generateTracking');

exports.getAllOutgoing = async (req, res) => {
  try {
    const outgoing = await Correspondence.find({ type: 'outgoing' })
      .populate('registeredBy', 'fullName')
      .populate('department', 'name')
      .populate('assignedTo', 'fullName')
      .sort({ createdAt: -1 });
    
    res.render('outgoing/index', {
      title: 'Outgoing Correspondence',
      outgoing
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching outgoing correspondence');
    res.redirect('/dashboard');
  }
};

exports.getAddOutgoing = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });
    res.render('outgoing/add', {
      title: 'Register Outgoing Correspondence',
      departments
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error loading form');
    res.redirect('/outgoing');
  }
};

exports.postAddOutgoing = async (req, res) => {
  try {
    const { referenceNumber, subject, recipientName, recipientOrg, recipientEmail, recipientPhone,
            recipientAddress, department, priority, description, dateSent } = req.body;
    
    const trackingNumber = generateTrackingNumber();
    
    const attachments = [];
    if (req.files) {
      req.files.forEach(file => {
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          path: '/uploads/' + file.filename,
          mimetype: file.mimetype,
          size: file.size
        });
      });
    }
    
    const correspondence = await Correspondence.create({
      trackingNumber,
      type: 'outgoing',
      referenceNumber,
      subject,
      recipient: {
        name: recipientName,
        organization: recipientOrg,
        email: recipientEmail,
        phone: recipientPhone,
        address: recipientAddress
      },
      dateSent: dateSent || Date.now(),
      priority,
      department: department || null,
      registeredBy: req.session.userId,
      description,
      status: 'pending',
      attachments
    });
    
    await Tracking.create({
      correspondence: correspondence._id,
      action: 'registered',
      fromUser: req.session.userId,
      remarks: 'Outgoing correspondence registered'
    });
    
    req.flash('success_msg', `Outgoing correspondence registered successfully. Tracking No: ${trackingNumber}`);
    res.redirect('/outgoing');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error registering outgoing correspondence');
    res.redirect('/outgoing/add');
  }
};

exports.viewOutgoing = async (req, res) => {
  try {
    const correspondence = await Correspondence.findById(req.params.id)
      .populate('registeredBy', 'fullName')
      .populate('department', 'name')
      .populate('assignedTo', 'fullName');
    
    const tracking = await Tracking.find({ correspondence: req.params.id })
      .populate('fromUser', 'fullName')
      .populate('toUser', 'fullName')
      .populate('toDepartment', 'name')
      .sort({ createdAt: -1 });
    
    res.render('outgoing/view', {
      title: 'View Correspondence',
      correspondence,
      tracking
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching correspondence');
    res.redirect('/outgoing');
  }
};
