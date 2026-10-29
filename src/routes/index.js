const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

router.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('home/index', { title: 'Home - Web-Based E-Post Management System', layout: 'layouts/main' });
});

module.exports = router;
