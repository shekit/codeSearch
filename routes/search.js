var express= require('express')
var router = express.Router();
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
	host: 'http://localhost:9200',
	log: ['trace','error']
	//apiVersion: "1.7" - throws an error
});

// Put elastic routes here

// search for query
router.post('/', function(req,res,next){
	var query = req.body.query;
	console.log(query);

	client.search({
		index: 'languages',
		type: 'p5',
		size: 5,
		body: {
			query:{
				match:{
					description: query
				}
			}
		}
	}).then(function(resp){
		var hits = resp.hits.hits;
		return res.send(hits);
	}, function(err){
		console.trace(err.message);
		return
	})
})

//update the index if the question matches and is correct
router.post('/update-positive', function(req, res, next){
	console.log("UPDATING POSITIVE:");
	console.log(req.body.id);
	return res.send("done");
})

//update the index is question doesnt match and is wrong
router.post('/update-negative', function(req, res, next){
	console.log("UPDATING NEGATIVE:");
	console.log(req.body.id);
	return res.send("done");
})


module.exports = router;

