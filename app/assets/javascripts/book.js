var countryLabel = 'label label-success';
var levelLabel = 'label label-primary';
var languageLabel = 'label label-warning';
var genreLabel = 'label label-info';
var subcategoryLabel = 'label label-info';

var InfiniteScroll = React.addons.InfiniteScroll;

$(document).ready(function() {
  ready();
});

$(document).on('page:load', function() {
  ready();
});
