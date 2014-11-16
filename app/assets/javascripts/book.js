$(document).ready(function() {
  ready();
});

function ready() {
  var mainSearch = $('#book-tagbar-input');
  mainSearch.tagsinput({
    tagClass: function(item) {
      switch (item.tagType) {
        case 'Location'   : return 'label label-primary';
        case 'Level': return 'label label-success';
        case 'Language'   : return 'label label-default';
        case 'Genre'     : return 'label label-warning';
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
  mainSearch.tagsinput('add', { "value": 1 , "text": "Elementary", "tagType": "Level" });
  mainSearch.tagsinput('add', { "value": 2 , "text": "Nigeria", "tagType": "Location" });
}