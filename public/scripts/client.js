$(function(){
  console.log('Document loaded')

  getBooks();

  //listen for sibmit event on form
  $('#book-form').on('submit', addBook);
});


function getBooks() {
  $.ajax({
    url: '/books',
    type: 'GET',
    success: displayBooks
  })
};

function displayBooks(books) {
  console.log('Got books from the server', books);
  $('#book-list').empty(); //appending out current book information

  books.forEach(function(book){  //for each book in list, append via jquery
    var $li = $('<l1></l1>'); //create list item via variable
    $li.append('<p><u>Title</u>' + ': ' + '<strong>' + book.title + '</strong></p>'); //inside list item, do this
    $li.append('<p><u>Author</u>' + ': ' + book.author + '</p>');

    var date = new Date(book.publication_date);  //new var to format date
    $li.append('<p><u>Date Published</u>' + ': ' + '<time>' + date.toDateString()+ '</time></p>'); //.toDateString is method that formats date to look pretty

    $li.append('<p><u>Edition</u>' + ': ' + book.edition + '</p>');
    $li.append('<span><p><u>Publisher</u><em>' + ': ' + book.publisher + '</em></p></span>');

    $('#book-list').append($li) //referencing li bvariable we created
  })
};

//event is what happens in addBook is called in submit events
function addBook(event) {
  event.preventDefault();

  //get info out of form
  var formData = $(this).serialize()  //.searlize method to format data that server will know

  //send data to server
  $.ajax ({
    url: '/books',
    type: 'POST',
    data: formData,
    success: getBooks
  })

}
