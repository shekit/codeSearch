$(document).ready(function(){

	//select form on page load
	$(".searchField").select();

	//form submit
	$("#searchForm").on('submit', function(event){
		event.preventDefault();
		var query = event.target.search.value;
		console.log("i have been submitted "+query);

		$.ajax({
			url:'http://localhost:3000/search',
			method: "POST",
			data: {"query":query}
		})
		.done(function(response){
			console.log("This is returned by server: ")
			displayResults(response);	//array of objects returned by elasticsearch
			//return response
		})
	})

	var displayResults = function(results){

		var resultDiv = $("#results");

		resultDiv.empty();

		for (result in results){
			var res = results[result]
			//console.log(res._source.description);
			var para = "<p>"+res._source.description+"</p>";
			var linkPos = "<a href='#' class='positive' id='"+res._id+"'>Positive</a>";
			var linkNeg = "<a href='#' class='negative' id='"+res._id+"'>Negative</a>";
			resultDiv.append(para+linkPos+" "+linkNeg)
		}
	}

	// tell es if this result is correct
	$("body").on('click', '.positive', function(event){
		event.preventDefault();
		var id = event.target.id;
		var query = $(".searchField").val().trim().toLowerCase();  //normalize the query string
		query = query.replace(/\s\s+/g," ");		// convert all whitespace to single spaces
		var type = 'p5';
		
		$.ajax({
			url: "http://localhost:3000/search/update-positive",
			method: "POST",
			data: {"type":type, "id": id, "question":query}
		}).done(function(response){
			console.log("success positive")
		})
	})

	// tell es if the result is wrong
	$("body").on('click', '.negative', function(event){
		event.preventDefault();
		var id = event.target.id;
		var query = $(".searchField").val().trim().toLowerCase();
		var type = 'p5';

		$.ajax({
			url: "http://localhost:3000/search/update-negative",
			method: "POST",
			data: {"type": type, "id": id, "question":query}
		}).done(function(response){
			console.log("success negative")
		})
	})


})