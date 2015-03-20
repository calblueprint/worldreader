/** @jsx React.DOM */

var baselistViews = {
  BASELISTS: 1,
  CREATE_BASELISTS: 2,
  EDIT_BASELISTS: 3
};

/* Shows all base list views.
 * This is the class that outside users of this file should view. */
var BaseListView = React.createClass({
  getInitialState: function() {
    return {view: baselistViews.BASELISTS};
  },
  viewBaseLists: function() {
    this.setState({view: baseListView.BASELISTS});
  }
  viewCreateBookLists: function() {
    this.setState({view: baseListViews.CREATE_BASELISTS});
  },
  viewEditBookLists: function() {
    this.setState({view: baseListViews.EDIT_BASELISTS});
  },
  render: function() {
    if (this.state.view == baseListViews.BASELISTS) {
      return (
        <BaseLists  viewCreateBookLists={this.viewCreateBookLists}
          viewEditBookLists={this.viewEditBookLists} />
      );
    } else if (this.state.view == baseListViews.CREATE_BASELISTS) {
      return (
        <CreateBaseList viewBookList={this.viewBaseLists} />
      );
    } else if (this.state.view == baseListViews.EDIT_BASELISTS) {
      return (
        <EditBaseList viewBookList={this.viewBaseLists} />
      );
    }
  }
});

var BaseLists = React.createClass({
  render: function() {
    return (
      <div>
        hi
      </div>
    );
  }
});
