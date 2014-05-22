// initialize Hoodie
var hoodie  = new Hoodie()

// initial load of all todo items from the store
hoodie.store.findAll('todo').then( function(todos) {
  todos.sort( sortByCreatedAt ).forEach( addTodo )
})

//Load best beers from store
hoodie.store.findAll('todo').then(function (reviews) {
  reviews.sort( sortByRating).forEach(topRated);
})



// when a new todo gets stored, add it to the UI
hoodie.store.on('add:todo', addTodo)
hoodie.store.on('remove:todo', removeTodo)
// clear todo list when the get wiped from store
hoodie.account.on('signout', clearTodos)




// handle creating a new task
$('#todoinput').on('keypress', function(event) {
 	if (event.keyCode == 13) { // ENTER
    	hoodie.store.add('todo', {title: event.target.value});
    	event.target.value = '';
  	}
})

$('#submitReview').on('click', function (event) {
    hoodie.store.add('todo', {
    	title: $('#todoinput').val(),
    	beer: $('#beerName').val(),
    	rating: $("#selectRating option:selected").text(),
      author: hoodie.account.username
	});

    //console.log( hoodie.account.username); 
    //event.target.value = '';
    //$('#todoinput').val() = '';
    $('#todoinput').val('');
    $('#beername').val('');

})

//Delete todo
$('.deleteReview').on('click', function (event) {
	//console.log('remove');
	hoodie.store.remove('todo' , $(this).attr('id'));
})







function addTodo( todo ) { 
	console.log('adding on frontend');
  //console.log(todo);
  $('#todolist').append(
  		'<li data-review="'+todo.id+'">'
  		+ 'Rating:' + todo.rating +  ' <small>By: ' +todo.author+ '</small>' +
  		'<br />' + todo.beer +  
  		'<a id="'+todo.id+'" class="deleteReview">x</a>' +'</li>');
}

function removeTodo (todo) {
	console.log('remove frontend');
	console.log(todo);
	//var item = '#' + todo.id;
	//$(this).remove();
	$("[data-review="+todo.id+"]").remove();
}

function clearTodos() {
  $('#todolist').html('');
}
function sortByCreatedAt(a, b) { 
  return a.createdAt > b.createdAt
}
function sortByRating(a, b) { 
  return a.rating < b.rating
}

function topRated(todo){
  $('#topRated').append('<p>'+ todo.beer +': ' + todo.rating+ '</p>');
}

