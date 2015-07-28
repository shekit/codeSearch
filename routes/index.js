var express = require('express');
var router = express.Router();

// Put page routes here
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code Search App' });
});

module.exports = router;
