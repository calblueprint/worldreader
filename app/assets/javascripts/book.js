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
  mainSearch.tagsinput('add', { "value": 1 , "text": "Elementary", "tagType": "levels" });
  mainSearch.tagsinput('add', { "value": 2 , "text": "Nigeria", "tagType": "locations" });

  $('#search-button').click(function() {
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
  })
}