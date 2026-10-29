const Correspondence = require('../models/Correspondence');
const Department = require('../models/Department');
const Tracking = require('../models/Tracking');
const generateTrackingNumber = require('../utils/generateTracking');

exports.getAllIncoming = async (req, res) => {
  try {
    const incoming = await Correspondence.find({ type: 'incoming' })
      .populate('registeredBy', 'fullName')
      .populate('department', 'name')
      .populate('assignedTo', 'fullName')
      .sort({ createdAt: -1 });
    
    res.render('incoming/index', {
      title: 'Incoming Correspondence',
      incoming
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching incoming correspondence');
    res.redirect('/dashboard');
  }
};

exports.getAddIncoming = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });
    res.render('incoming/add', {
      title: 'Register Incoming Correspondence',
      departments
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error loading form');
    res.redirect('/incoming');
  }
};

exports.postAddIncoming = async (req, res) => {
  try {
    const { referenceNumber, subject, senderName, senderOrg, senderEmail, senderPhone, 
            senderAddress, department, priority, description, dateReceived } = req.body;
    
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
      type: 'incoming',
      referenceNumber,
      subject,
      sender: {
        name: senderName,
        organization: senderOrg,
        email: senderEmail,
        phone: senderPhone,
        address: senderAddress
      },
      dateReceived: dateReceived || Date.now(),
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
      remarks: 'Incoming correspondence registered'
    });
    
    req.flash('success_msg', `Incoming correspondence registered successfully. Tracking No: ${trackingNumber}`);
    res.redirect('/incoming');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error registering incoming correspondence');
    res.redirect('/incoming/add');
  }
};

exports.viewIncoming = async (req, res) => {
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
    
    res.render('incoming/view', {
      title: 'View Correspondence',
      correspondence,
      tracking
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching correspondence');
    res.redirect('/incoming');
  }
};
