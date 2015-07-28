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

		for (result in results){
			var res = results[result]
			console.log(res._source.description);
			var para = "<p>"+res._source.description+"</p>";
			var linkPos = "<a href='http://localhost:9200/search/update-positive' class='positive' id='"+res._id+"'>Positive</a>";
			var linkNeg = "<a href='http://localhost:9200/search/update-negative' class='negative' id='"+res._id+"'>Negative</a>";
			resultDiv.append(para+linkPos+" "+linkNeg)
		}
	}

})