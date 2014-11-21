$(document).ready(function() {
  ready();
});


function ready() {
  var mainSearch = $('#book-tagbar-input');
  mainSearch.tagsinput({
    tagClass: function(item) {
      switch (item.tagType) {
        case 'locations'   : return 'label label-primary';
        case 'levels': return 'label label-success';
        case 'language'   : return 'label label-default';
        case 'genre'     : return 'label label-warning';
        case 'recommended'     : return 'label label-danger';
      }
    },
    itemValue: 'value',
    itemText: 'text',
    typeahead: {
      name: 'cities',
      displayKey: 'text',
      source: gon.all_tags
    }
  });
  mainSearch.tagsinput('add', { "value": 1 , "text": "Recommended", "tagType": "recommended" });
  search();

  $('#book-searchbar-input').keypress(function (e) {
    if (e.which == 13) {
      search();
      return false;
    }
  });

  mainSearch.on('itemAdded', function(event) {
    search();
  });

  mainSearch.on('itemRemoved', function(event) {
    search();
  });

  $('#search-button').click(function() {
    search();
  });
}

function search() {
  $.ajax({
    type: "GET",
    url: "/api/v1/books/search/",
    data: {
      tags: JSON.stringify($('#book-tagbar-input').tagsinput('items')),
      term: $('#book-searchbar-input').val()
    }
  }).done(function(results) {
    bookList.handleBooksUpdate(results);
  });
}