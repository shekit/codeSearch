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
		.done(function(resp){
			console.log("This is returned by server: ")
			console.log(resp)	
		})
	})

})