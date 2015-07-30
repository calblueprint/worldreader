//= require_self
//= require react_ujs

React = require('react/addons');

// put react components here

InfiniteScroll = require('./react_components/react-infinite-scroll');
ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

/* Book Search Page */
BookList = require('./react_components/book');
TagModalContent = require('./react_components/tag_modal');
BookTile = require('./react_components/book_tiles');

/* Users BookLists */
PublishedBookLists = require('./react_components/book_lists');
BookLists = require('./react_components/users/booklists');
BookListTable = require('./react_components/users/booklist_table');

/* Admin Dashboard */
DashboardTabs = require('./react_components/admin_dashboard/admin_dashboard');
BookStatusView = require('./react_components/admin_dashboard/book_statuses');

/* Admin Dasboard BaseLists */
BaseListView = require('./react_components/admin_dashboard/baselists/baselist_view');
BaseLists = require('./react_components/admin_dashboard/baselists/baselists');
CreateBaseList = require('./react_components/admin_dashboard/baselists/create_baselists');
EditBaseList = require('./react_components/admin_dashboard/baselists/edit_baselists');
BaseBookListSearch = require('./react_components/admin_dashboard/baselists/base_booklist_search');

/* Admin Dasboard Partners */
GroupDisplay = require('./react_components/admin_dashboard/partners/groups');
InformationDisplay = require('./react_components/admin_dashboard/partners/information');
ManagePartnerInfo = require('./react_components/admin_dashboard/partners/partners');

/* Global */
LoadingIndicator = require('./react_components/loading_indicator');
