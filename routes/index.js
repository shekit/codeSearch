var express = require('express');
var router = express.Router();

// Put page routes here
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code Search App' });
});

//return new result page
router.post('/results', function(req, res, next){
	var searchField = req.body.searchField;
	var typeOption = req.body.type;
	return res.render('resultPage',{search: searchField, type: typeOption});
})

module.exports = router;
