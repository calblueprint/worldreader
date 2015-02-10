var countryLabel = 'label label-success';
var levelLabel = 'label label-primary';
var languageLabel = 'label label-warning';
var genreLabel = 'label label-info';
var recommendedLabel = 'label label-danger';

var InfiniteScroll = React.addons.InfiniteScroll;

$(document).ready(function() {
  ready();
});

$(document).on('page:load', function() {
  ready();
});

function ready() {
  var mainSearch = $('#book-tagbar-input');
  mainSearch.tagsinput({
    tagClass: function(item) {
      switch (item.tagType) {
        case 'countries': return countryLabel;
        case 'levels': return levelLabel;
        case 'language': return languageLabel;
        case 'genre': return genreLabel;
        case 'recommended': return recommendedLabel;
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

  $('#book-searchbar-input').keypress(function (e) {
    if (e.which == 13) {
      search();
      return false;
    }
  });

  mainSearch.on('itemAdded', search);

  mainSearch.on('itemRemoved', search);

  $('#search-button').click(search);
 
  $('#tag-and-searchbar').affix({
      offset: {
        top: $('#index-image').height()
      }
  });
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
