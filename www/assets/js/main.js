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

function filter(term){
  //console.log('Tag is:' + term);
  hoodie.global.findAll('todo').done(function (objects) {
    filterBeers(objects , term);
    function filterBeers(db, name) {
      var results;
      name = name.toUpperCase();
      results = db.filter(function(entry) {
        console.log('tag: ' + entry.tag);
        return entry.tag.toUpperCase().indexOf(name) !== -1;
      });
      searchResults(results, term);
      console.log(results);
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
    	beer: $('#beerName').val(),
      tag: $('#beerType').val(),
      brewery: $('#beerBrewery').val(),
      abv: $('#beerAbv').val(),
    	rating: $("#selectRating option:selected").text(),
      notes: $('#notes').val(),
      author: hoodie.account.username
  });
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

//Filter by tag
$('body').on('click','.dataFilter', function (e) {
  e.preventDefault();
  var term = $(this)[0]['innerText'];
  filter(term);
})




function addTodo( review ) { 
	console.log('adding on frontend');
  $('#todolist').append(
  		'<li data-review="'+review.id+'"><a class="openReview" data-review="'+review.id+'">'
  		+ 'Rating:' + review.rating +  '</a> <small>By: ' +review.author+ '</small>' +
  		'<br />' + review.beer +  
  		'<a id="'+review.id+'" class="deleteReview">x</a>' +'</li>');
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

function topRated(review){
  $('#topRated').append('<li><a href="#" class="openReview" data-review="'+ review.id +'">'+ review.beer +': ' + review.rating+ '</a></li>');
}

function searchResults(results, term) {
  $('#queryTitle').html('<h3>Searching for <strong>' + term + '</strong></h3>');
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
    '<h2>'+review.beer+' <small><a class="dataFilter">'+review.tag+'</a></small></h2>'+
    '<small><p>reviewed by: <strong>'+review.author+'</strong></p></small>' +
    '<p>'+review.notes+'</p>' +
    '<hr>'
    )
}




var crookedApp = angular.module('crookedApp', []);

crookedApp.controller('PhoneListCtrl', function ($scope) {

    //var dataAsText = JSON.stringify(reviews);

    //db = reviews;
   // console.log('rev: ');

    //$scope.phones = db;
    /*
    $scope.phones = [{'name': 'Nexus S', "_rev":"3-k359ln70t","beer":"Spitfire","tag":"IPA","brewery":"","abv":"5.0","rating":"4","notes":"It's great!","author":"raf","createdBy":"7ly1ixb","updatedAt":"2014-05-26T15:02:07.771Z","createdAt":"2014-05-26T15:01:50.828Z","$public":true,"type":"todo","id":"avnfsz9"},
                    {"_rev":"103-f9n4knruv","beer":"Kernels","tag":"Stout","brewery":"Kernels","abv":"6.5","rating":"5","notes":"Fucking lovely!","author":"adam","createdBy":"69lwfe0","updatedAt":"2014-05-26T22:54:48.543Z","createdAt":"2014-05-26T15:03:36.808Z","$public":true,"type":"todo","id":"cln99fo"},
                    {"_rev":"18-jqttdlkc5","beer":"IPA","tag":"IPA","rating":"3","notes":"Stuff","author":"raf","createdBy":"7ly1ixb","updatedAt":"2014-05-26T15:02:07.774Z","createdAt":"2014-05-26T14:23:10.380Z","$public":true,"type":"todo","id":"d5u7iay"},
                    {"_rev":"16-eakvvh4a6","beer":"Punk","tag":"IPA","rating":"4","notes":"","author":"raf","createdBy":"7ly1ixb","updatedAt":"2014-05-26T15:02:07.773Z","createdAt":"2014-05-26T14:25:22.657Z","$public":true,"type":"todo","id":"n5kvpdn"}];
    */
    //console.log($scope.phones);



  hoodie.global.findAll('todo').done(function (reviews) { 


    $scope.$watchCollection('reviews', function(newValue, oldValue) {
      $scope.beers = reviews; 
      console.log(newValue);
    });
    $scope.$digest();

  // var dataAsText = JSON.stringify(reviews);

  //$('#searchResults').html(dataAsText);
  //console.log('reviews: ');
    //console.log(reviews);
    //var db = reviews;
    //$scope.phones = reviews;  

    //console.log('data: ');
    //console.log(reviews[0].beer);

  })    
//  $scope.phones = reviews;
//  console.log(db); 
});


