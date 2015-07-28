var express= require('express')
var router = express.Router();


// Put elastic routes here

router.get('/:query', function(req,res,next){
	var query = req.params.query;
	console.log(query);
	return res.send(query)
})

module.exports = router;

