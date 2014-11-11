$(document).ready(function() {
  ready();
});

function ready() {
  var mainSearch = $('.typeahead');
  mainSearch.tagsinput({
    tagClass: function(item) {
      switch (item.continent) {
        case 'Location'   : return 'label label-primary';
        case 'Age': return 'label label-success';
        case 'Language'   : return 'label label-default';
        case 'America'  : return 'label label-danger label-important';
        case 'Asia'     : return 'label label-warning';
      }
    },
    itemValue: 'value',
    itemText: 'text',
    typeahead: {
      name: 'cities',
      displayKey: 'text',
      source: [ { "value": 1 , "text": "Nigeria"   , "continent": "Location"    },
        { "value": 2 , "text": "Ethiopia"      , "continent": "Location"    },
        { "value": 3 , "text": "Egypt"       , "continent": "Location"    },
        { "value": 4 , "text": "South Africa"  , "continent": "Location"   },
        { "value": 5 , "text": "Tanzania" , "continent": "Location"   },
        { "value": 6 , "text": "Kenya", "continent": "Location"   },
        { "value": 7 , "text": "1-4"      , "continent": "Age" },
        { "value": 8 , "text": "5-8"  , "continent": "Age" },
        { "value": 9 , "text": "8-12"    , "continent": "Age" },
        { "value": 10 , "text": "Hausa"      , "continent": "Language" },
        { "value": 11 , "text": "Oromo"  , "continent": "Language" },
        { "value": 12 , "text": "Somali"    , "continent": "Language" }
      ]
    }
  });
  mainSearch.tagsinput('add', { "value": 1 , "text": "Nigeria"   , "continent": "Location"    });
  mainSearch.tagsinput('add', { "value": 7 , "text": "1-4"      , "continent": "Age" });
}