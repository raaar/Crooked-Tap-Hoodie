// initialize Hoodie
var hoodie  = new Hoodie()

//Make DB global
hoodie.store.findAll('todo').publish()

// initial load of all todo items from the store
hoodie.store.findAll('todo').then( function(todos) {
  todos.sort( sortByCreatedAt ).forEach( addTodo )
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
      notes: $('#notes').val(),
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


//Open Review
$('body').on('click','.openReview' ,function(event){
  var id = $(this).attr('data-review');
  //console.log(id);
  //renderReview(id);
  hoodie.global.find('todo', id).done(function (object) {
    renderReview(object);
  });
})





function addTodo( todo ) { 
	console.log('adding on frontend');
  $('#todolist').append(
  		'<li data-review="'+todo.id+'"><a class="openReview" data-review="'+todo.id+'">'
  		+ 'Rating:' + todo.rating +  '</a> <small>By: ' +todo.author+ '</small>' +
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
  console.log('Searching for: ' +  term );
  $('#searchResults').html('');
  if(results.length < 1) {
    $('#searchResults').html('Sorry, <strong><em>' +  term + '</em></strong> not found');
  } else {
    results.forEach(function(review){
      console.log(review);
       $('#searchResults').append('<li><a href="#" class="openReview" data-review="'+ review.id +'">'+ review.beer +': ' + review.rating+ '</a></li>');
    });
  }
}


//creates view for a single review
function renderReview(review){
  console.log(review);
  $('#review').html('');
  $('#review').append(
    '<h2>'+review.beer+' <small>Beer type</small></h2>'+
    '<small><p>reviewed by: <strong>'+review.author+'</strong></p></small>' +
    '<p>'+review.notes+'</p>' +
    '<hr>'
    )
}

