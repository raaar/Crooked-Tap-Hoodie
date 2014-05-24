// initialize Hoodie
var hoodie  = new Hoodie()

//Make DB global
hoodie.store.findAll('todo').publish()

// initial load of all todo items from the store
hoodie.store.findAll('todo').then( function(todos) {
  todos.sort( sortByCreatedAt ).forEach( addTodo )
})

//Load best beers from store
hoodie.store.findAll('todo').then(function (reviews) {
//  reviews.sort( sortByRating).forEach(topRated);
})


hoodie.global.findAll('todo').done(function (reviews) { 
  reviews.sort( sortByRating).forEach(topRated);
});


function search(term){
  hoodie.store.findAll('todo').done(function (objects) {
    filterBeers(objects , term);
    function filterBeers(db, name) {
      var results;
      name = name.toUpperCase();
      results = db.filter(function(entry) {
        return entry.beer.toUpperCase().indexOf(name) !== -1;
      });
      searchResults(results, term);
    }
  });  
}




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

// Construct review object
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

//Search by name
$('#search').on('keypress', function(event){
  if(event.keyCode == 13) { 
    var query = $('#search').val();
    search(query); 
  }
})

//Delete todo
$('.deleteReview').on('click', function (event) {
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


function searchResults(results, term) {
  $('#searchResults').html('');
  if(results.length < 1) {
    $('#searchResults').html('Sorry, <strong><em>' +  term + '</em></strong> not found');
  } else {
    results.forEach(function(review){
      console.log(review);
       $('#searchResults').append('<p>'+ review.beer +': ' + review.rating+ '</p>');
    });
  }
}