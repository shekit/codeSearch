var express= require('express')
var router = express.Router();
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
	host: 'http://localhost:9200',
	log: ['trace','error']
	//apiVersion: "1.7" - throws an error
});

// Put elastic routes here

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

router.get('/:query', function(req,res,next){
	var query = req.params.query;
	console.log(query);
	return res.send(query)
})



module.exports = router;

