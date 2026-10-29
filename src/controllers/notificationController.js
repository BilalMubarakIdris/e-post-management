const Notification = require('../models/Notification');

exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.session.userId })
      .populate('correspondence')
      .sort({ createdAt: -1 });
    
    res.render('notifications/index', {
      title: 'Notifications',
      notifications
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching notifications');
    res.redirect('/dashboard');
  }
};

exports.markRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification && notification.recipient.toString() === req.session.userId) {
      notification.isRead = true;
      await notification.save();
      if (notification.link) {
        return res.redirect(notification.link);
      }
    }
    res.redirect('/notifications');
  } catch (error) {
    console.error(error);
    res.redirect('/notifications');
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.session.userId, isRead: false }, { isRead: true });
    req.flash('success_msg', 'All notifications marked as read');
    res.redirect('/notifications');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error marking notifications');
    res.redirect('/notifications');
  }
};
