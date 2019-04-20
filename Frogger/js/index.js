//the folliwing is a boolean value that would help make sure 
//the like/dislike buttons can only be effective once

let clicked = false;
function disableButtons(){
	document.getElementById("thumbs-up").style.cursor='not-allowed';
	document.getElementById("thumbs-down").style.cursor='not-allowed';
}
function updateLikes(){
	if(clicked == false){
		console.log("updating likes----");
		var likes = document.getElementById("likes").innerHTML;
		var likes_int = parseInt(likes);
		likes_int++;
		console.log(likes_int);
		var url ='http://localhost:3000/tictactoe/addlikes'+'?likes='+likes_int;
	      $.ajax({url:url}).then(function(data) {
	      	console.log(data);
	      });
		document.getElementById("likes").innerHTML = likes_int;
		document.getElementById("thumbs-up").style.color = 'green';
		disableButtons();
		document.body.removeEventListener('click', updateDislikes);
		
		
	}
	clicked = true;
	return false;
}


function updateDislikes(){
	if(clicked == false){
		console.log("updating dislikes----");
		var dislikes = document.getElementById("dislikes").innerHTML;
		var dislikes_int = parseInt(dislikes);
		dislikes_int++;
		var url ='http://localhost:3000/tictactoe/addlikes'+'?dislikes='+dislikes_int;
	      $.ajax({url:url}).then(function(data) {
	      	console.log(data);
	      });
		document.getElementById("dislikes").innerHTML = dislikes_int;
		document.getElementById('thumbs-down').style.color = 'red';
		document.body.removeEventListener('click', updateDislikes);
		disableButtons();
		
	}
	clicked = true;
	return false;
}

//this updates the review tab to thank the user
//for submitting their review
function changeReview(){
	console.log("in change review page");
	var string = "<h1> Thank you for reviewing the game!</h1><br><br><br>";
	document.getElementById("review").innerHTML = string;
}