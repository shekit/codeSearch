$(document).ready(function(){

	var searchFrom = 0; //index to begin searching from
	var firstTime = true;

	//select form on page load
	$(".searchField").select();

	//show examples of searches
	$(".search-examples").typed({
		strings: ["how to draw an ellipse^300 ", "find the square root of a number^300", "draw a square^300", "how to stop the draw loop^300"],
		typeSpeed: 5,
		backSpeed:0,
		loop:true,
		showCursor:false
	});

	//syntax highlighting
	var highlight = function(){
		$('code').addClass('javascript')
		$('pre code').each(function(i,block){
		hljs.highlightBlock(block);
		})
	}

	//reload page when clicking on small logo
	$("body").on('click', '.logo-small', function(event){
		event.preventDefault();
		location.reload();
	})

	//select text in search field 
	$("body").on('click', '.searchFieldNew', function(event){
		$(this).select();
	})

	//form submit
	$("body").on('submit','#searchFormNew',function(event){
		event.preventDefault();
		var query = event.target.search.value;
		query = stripStopWords(query);
		var type = $("#typeNew :selected").val();
		searchFrom = 0; //reset from variable to 0 since its the first search
		console.log("i have been submitted "+query);

		getResult(type,query,searchFrom);
	});

	//perform search
	$("body").on('keyup', '.searchFieldNew', function(event){
		searchFrom = 0; //reset from variable to 0 since its the first search
		delaySearch(function(){
			console.log("calling calling");
			var query = event.target.value;
			query = stripStopWords(query);
			var type = $("#typeNew :selected").val();
			console.log("TYPE: "+type);
			searchFrom = 0; //reset from variable to 0 since its the first search
			console.log("i have been submitted "+query);

			getResult(type,query,searchFrom);
		}, 200);
	})

	//function to throttle ajax calls to es
	var delaySearch = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout(timer);
			timer = setTimeout(callback, ms)
		}
	})();

	//reperform search on change of select element
	$("body").on('change', '#typeNew', function(event){
		console.log("changed select type");
		var query = $(".searchFieldNew").val();
		query = stripStopWords(query);
		var type = $("#typeNew :selected").val();
		console.log("TYPE: "+type);
		searchFrom = 0; //reset from variable to 0 since its the first search
		console.log("i have been submitted "+query);

		getResult(type,query,searchFrom);
	})

	//first call to change page layout
	$("#searchForm").on('keyup', function(event){
		if(firstTime){
			firstTime = false;
			var type = $("#type :selected").val();
			$.ajax({
			url:"http://localhost:3000/results",
			method: "POST",
			data:{"searchField":event.target.value, "type":type}
			}).done(function(response){
				jumpToResultPage(response);
				//keep lang selected when page changes
				$("#typeNew option[value="+type+"]").prop('selected',true)
			})
		}
	});

	var jumpToResultPage = function(response){
		$("#wrapper").empty();
		$("#wrapper").append(response);
		//set cursor at end of field so can continue typing
		var field = $(".searchFieldNew").get(0);
		var fieldLength = field.value.length;
		field.selectionStart = fieldLength;
		field.selectionEnd = fieldLength;
		field.focus();
	}

	// tell es if this result is correct
	$("body").on('click', '.positive', function(event){
		event.preventDefault();
		var id = $(".positive").attr('id');
		//var query = $(".searchField").val().trim().toLowerCase();  //normalize the query string
		
		var query = $(".searchFieldNew").val();
		query = stripStopWords(query);
		
		var type = $("#typeNew :selected").val();

		console.log(query);
		
		//hide the negative link
		$(".negative").fadeOut(100);
		$(".positive-text").fadeOut(100);

		//change look of the positive link
		$(this).addClass('accepted');

		//save it to the positive question array in es
		$.ajax({
			url: "http://localhost:3000/search/update-positive",
			method: "POST",
			data: {"type":type, "id": id, "query":query}
		}).done(function(response){
			console.log("success positive")
		})
	})

	// tell es to return next result
	$("body").on('click', '.negative', function(event){
		event.preventDefault();
		// var id = event.target.id;
		// var query = $(".searchField").val().trim().toLowerCase();
		// var type = 'p5';

		// $.ajax({
		// 	url: "http://localhost:3000/search/update-negative",
		// 	method: "POST",
		// 	data: {"type": type, "id": id, "question":query}
		// }).done(function(response){
		// 	console.log("success negative")
		// })
		searchFrom++; //increment counter to get next result
		var query = $(".searchFieldNew").val();
		query = stripStopWords(query);
		var type = $("#typeNew :selected").val();
		console.log("TYPE: " + type)
		console.log("RESUBMITTING: "+query)

		getResult(type,query,searchFrom);
	})

	var getResult = function(type,query,from){
		//$(".loader").css({'display':'block'});
		$.ajax({
			url:'http://localhost:3000/search',
			method: "POST",
			data: {"type":type, "query":query, "from":from}
		})
		.done(function(response){
			console.log("GOT RESULTS")
			//$(".loader").css({'display':'none'});
			displayResults(response);	//array of objects returned by elasticsearch
		}).fail(function(response){
			console.log(response);
		})
	}

	var stripStopWords = function(input){
		// choose one of the two stop word lists
		var stop_words = ['a', 'able', 'about', 'above', 'abroad', 'according', 'accordingly', 'actually', 'adj', 'afterwards', 'again', 'against', 'ago', 'ahead', 'aint', 'all', 'allow', 'allows', 'almost', 'alone', 'along', 'alongside', 'already', 'also', 'although', 'always', 'am', 'amid', 'amidst', 'among', 'amongst', 'an', 'and', 'another', 'any', 'anybody', 'anyhow', 'anyone', 'anything', 'anyway', 'anyways', 'anywhere', 'apart', 'appear', 'appreciate', 'appropriate', 'are', 'arent', 'around', 'as', 'aside', 'ask', 'asking', 'associated', 'at', 'available', 'away', 'awfully', 'b', 'backward', 'backwards', 'be', 'became', 'because', 'become', 'becomes', 'becoming', 'been', 'before', 'beforehand', 'behind', 'being', 'believe', 'below', 'beside', 'besides', 'best', 'better', 'between', 'beyond', 'both', 'brief', 'but', 'by', 'c', 'came', 'can', 'cannot', 'cant', 'cant', 'caption', 'cause', 'causes', 'certain', 'certainly', 'changes', 'clearly', 'cmon', 'co', 'co.', 'com', 'come', 'comes', 'concerning', 'consequently', 'consider', 'considering', 'containing', 'corresponding', 'could', 'couldnt', 'course', 'cs', 'currently', 'd', 'dare', 'darent', 'definitely', 'described', 'despite', 'did', 'didnt', 'different', 'directly', 'do', 'does', 'doesnt', 'doing', 'done', 'dont', 'down', 'downwards', 'during', 'e', 'each', 'edu', 'eg', 'eight', 'eighty', 'either', 'else', 'elsewhere', 'end', 'ending', 'enough', 'entirely', 'especially', 'et', 'etc', 'even', 'ever', 'evermore', 'every', 'everybody', 'everyone', 'everything', 'everywhere', 'ex', 'exactly', 'example', 'except', 'f', 'fairly', 'far', 'farther', 'few', 'fewer', 'fifth', 'five', 'followed', 'following', 'follows', 'former', 'formerly', 'forth', 'forward', 'found', 'four','further', 'furthermore', 'g', 'get', 'gets', 'getting', 'given', 'gives', 'go', 'goes', 'going', 'gone', 'got', 'gotten', 'greetings', 'h', 'had', 'hadnt', 'happens', 'hardly', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hence', 'her', 'here', 'hereafter', 'hereby', 'herein', 'heres', 'hereupon', 'hers', 'herself', 'hes', 'hi', 'him', 'himself', 'his', 'hither', 'hopefully', 'how', 'howbeit', 'however', 'hundred', 'id', 'ie', 'ignored', 'ill', 'im', 'immediate', 'in', 'inasmuch', 'inc', 'inc.', 'indeed', 'indicate', 'indicated', 'indicates','insofar', 'instead', 'into', 'inward', 'is', 'isnt', 'it', 'itd', 'itll', 'its', 'its', 'itself', 'ive', 'j', 'just', 'k', 'keep', 'keeps', 'kept', 'know', 'known', 'knows', 'l', 'lately', 'later', 'latter', 'latterly', 'least', 'less', 'lest', 'let', 'lets', 'like', 'liked', 'likely', 'likewise', 'little', 'look', 'looking', 'looks', 'low', 'lower', 'ltd', 'm', 'made', 'mainly', 'make', 'makes', 'many', 'may', 'maybe', 'maynt', 'me', 'mean', 'meantime', 'meanwhile', 'merely', 'might', 'mightnt', 'mine', 'minus', 'miss', 'more', 'moreover', 'most', 'mostly', 'mr', 'mrs', 'much', 'must', 'mustnt', 'my', 'myself', 'n', 'namely', 'nd', 'near', 'nearly', 'necessary', 'need', 'neednt', 'needs', 'neither', 'never', 'neverf', 'neverless', 'nevertheless', 'new', 'next', 'nine', 'ninety', 'no', 'nobody', 'non', 'none', 'nonetheless', 'noone', 'no-one', 'nor', 'normally', 'not', 'nothing', 'notwithstanding', 'novel', 'now', 'nowhere', 'o', 'obviously', 'of', 'off', 'often', 'oh', 'ok', 'okay', 'old', 'on', 'once', 'one', 'ones', 'ones', 'only', 'onto', 'opposite', 'or', 'other', 'others', 'otherwise', 'ought', 'oughtnt', 'our', 'ours', 'ourselves', 'out', 'outside', 'over', 'overall', 'own', 'p', 'particular', 'particularly', 'past', 'per', 'perhaps', 'placed', 'please', 'plus', 'possible', 'presumably', 'probably', 'provided', 'provides', 'q', 'que', 'quite', 'qv', 'r', 'rather', 'rd', 're', 'really', 'reasonably', 'recent', 'recently', 'regarding', 'regardless', 'regards', 'relatively', 'respectively', 'right', 's', 'said', 'same', 'saw', 'say', 'saying', 'says', 'secondly', 'see', 'seeing', 'seem', 'seemed', 'seeming', 'seems', 'seen', 'selves', 'sensible', 'serious', 'seriously', 'seven', 'several', 'shall', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'since', 'six', 'so', 'some', 'somebody', 'someday', 'somehow', 'someone', 'something', 'sometime', 'sometimes', 'somewhat', 'somewhere', 'soon', 'sorry', 'specified', 'specify', 'specifying', 'still', 'such', 'sup', 'sure', 't', 'take', 'taken', 'taking', 'tell', 'tends', 'th', 'than', 'thank', 'thanks', 'thanx', 'that', 'thatll', 'thats', 'thats', 'thatve', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'thence', 'there', 'thereafter', 'thereby', 'thered', 'therefore', 'therein', 'therell', 'therere', 'theres', 'theres', 'thereupon', 'thereve', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'thing', 'things', 'think', 'third', 'thirty', 'this', 'thorough', 'thoroughly', 'those', 'though', 'through', 'throughout', 'thru', 'thus', 'till', 'to', 'together', 'too', 'took', 'toward', 'towards', 'tried', 'tries', 'truly', 'try', 'trying', 'ts', 'twice', 'u', 'un', 'under', 'underneath', 'undoing', 'unfortunately', 'unless', 'unlike', 'unlikely', 'until', 'unto', 'up', 'upon', 'upwards', 'us', 'use', 'used', 'useful', 'uses', 'using', 'usually', 'v', 'value', 'various', 'very', 'via', 'viz', 'w', 'want', 'wants', 'was', 'wasnt', 'way', 'we', 'wed', 'welcome', 'well', 'well', 'went', 'were', 'were', 'werent', 'weve', 'what', 'whatever', 'whatll', 'whats', 'whatve', 'when', 'whence', 'whenever', 'where', 'whereafter', 'whereas', 'whereby', 'wherein', 'wheres', 'whereupon', 'wherever', 'whether', 'which', 'whichever', 'while', 'whilst', 'whither', 'who', 'whod', 'whoever', 'whole', 'wholl', 'whom', 'whomever', 'whos', 'whose', 'why', 'will', 'willing', 'wish', 'wonder', 'wont', 'would', 'wouldnt', 'yes', 'yet', 'you', 'youd', 'youll', 'your', 'youre', 'yours', 'yourself', 'yourselves', 'youve']
		//var lucene_stop_words = ["a", "an", "and", "are", "as", "at", "be", "but", "by","for", "if", "in", "into", "is", "it","no", "not", "of", "on", "or", "such","that", "the", "their", "then", "there", "these","they", "this", "to", "was", "will", "with"];

		var filtered = input.split(/\b/).filter(function(v){
			return stop_words.indexOf(v) == -1
		})

		var result = filtered.join('').trim().toLowerCase();  //trim trailing and leading whitespace
		result = result.replace(/\s\s+/g," "); //replace all whitespace with single space
		console.log("RESULT: "+result)  
		return result
	}

	var displayResults = function(results){

		var resultDiv = $("#results");

		resultDiv.empty();

		resultDiv.append(results);

		highlight();
		// for (result in results){
		// 	var res = results[result]
		// 	//console.log(res._source.description);
		// 	var para = "<p>"+res._source.description+"</p>";
		// 	var linkPos = "<a href='#' class='positive' id='"+res._id+"'>Positive</a>";
		// 	var linkNeg = "<a href='#' class='negative' id='"+res._id+"'>Negative</a>";
		// 	resultDiv.append(para+linkPos+" "+linkNeg)
		// }
	}
})