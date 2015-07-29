var express = require('express');
var router = express.Router();

// Put page routes here
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code Search App' });
});

router.post('/results', function(req, res, next){
	var searchField = req.body.searchField;
	return res.render('resultPage',{search: searchField});
})

module.exports = router;
