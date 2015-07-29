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
				multi_match:{
					query:query,
					fields:["positive_questions","description"]
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

	// client.search({
	// 	index: 'languages',
	// 	type: 'p5',
	// 	size: 5,
	// 	body: {
	// 		query:{
	// 			bool:{
	// 				must:{
	// 					match:{
	// 						positive_questions:query
	// 					}
	// 				},
	// 				must_not: {
	// 					match:{
	// 						negative_questions:query
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }).then(function(resp){
	// 	var hits = resp.hits.hits;
	// 	return res.send(hits);
	// }, function(err){
	// 	console.trace(err.message);
	// 	return
	// })
})

//update the index if the question matches and is correct
router.post('/update-positive', function(req, res, next){
	console.log("UPDATING POSITIVE:");
	console.log(req.body.id);

	//add question to positive question list in es
	client.update({
		index: 'languages',
		type: req.body.type,
		id: req.body.id,
		body: {
			script: 'if(!ctx._source.positive_questions.contains(new_question)){ctx._source.positive_questions+=new_question}',   //only add if the question doesnt already exist in the list
			params: {
				"new_question":req.body.question
			}
		}
	}).then(function(resp){
		return res.send(resp._version)
	}, function(err){
		console.trace(err.message)
		return
	})
})

//update the index is question doesnt match and is wrong
router.post('/update-negative', function(req, res, next){
	console.log("UPDATING NEGATIVE:");
	console.log(req.body.id);

	client.update({
		index: 'languages',
		type: req.body.type,
		id: req.body.id,
		body: {
			script: 'if(!ctx._source.negative_questions.contains(new_question)){ctx._source.negative_questions+=new_question}',   // only add if question doesnt already exist in the list
			params:{
				"new_question":req.body.question
			}
		}
	}).then(function(resp){
		return res.send(resp._version)
	}, function(err){
		console.trace(err.message)
		return
	})
})


module.exports = router;

