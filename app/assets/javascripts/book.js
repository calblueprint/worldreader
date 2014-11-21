var locationLabel = 'label label-success';
var levelLabel = 'label label-primary';
var languageLabel = 'label label-warning';
var genreLabel = 'label label-info';
var recommendedLabel = 'label label-danger';

$(document).ready(function() {
  ready();
});

function ready() {
  var mainSearch = $('#book-tagbar-input');
  mainSearch.tagsinput({
    tagClass: function(item) {
      switch (item.tagType) {
        case 'locations'   : return locationLabel;
        case 'levels': return levelLabel;
        case 'language'   : return languageLabel;
        case 'genre'     : return genreLabel;
        case 'recommended'     : return recommendedLabel;
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
  mainSearch.tagsinput("add", {
    "value": 1,
    "text": "Recommended",
    "tagType": "recommended"
  });
  search();

  $('#book-searchbar-input').keypress(function (e) {
    if (e.which == 13) {
      search();
      return false;
    }
  });

  mainSearch.on('itemAdded', search);

  mainSearch.on('itemRemoved', search);

  $('#search-button').click(search);
}

function search() {
  $.ajax({
    type: 'GET',
    url: '/api/v1/books/search/',
    data: {
      tags: JSON.stringify($('#book-tagbar-input').tagsinput('items')),
      term: $('#book-searchbar-input').val()
    }
  }).done(function(results) {
    bookList.handleBooksUpdate(results);
  });
}