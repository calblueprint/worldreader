/** @jsx React.DOM */

var React = require('react');

var baseListViews = {
  BASELISTS: 1,
  CREATE_BASELISTS: 2,
  EDIT_BASELISTS: 3
};

/* Shows all base list views.
 * This is the class that outside users of this file should view. */
var BaseListView = React.createClass({
  getInitialState: function() {
    return {view: baseListViews.BASELISTS};
  },
  viewBaseLists: function() {
    this.setState({view: baseListViews.BASELISTS});
  },
  viewCreateBookLists: function() {
    this.setState({view: baseListViews.CREATE_BASELISTS});
  },
  viewEditBookLists: function(baselist) {
    this.setState({view: baseListViews.EDIT_BASELISTS, baselist: baselist});
  },
  render: function() {
    if (this.state.view == baseListViews.BASELISTS) {
      return (
        <BaseLists  viewCreateBookLists={this.viewCreateBookLists}
                    viewEditBookLists={this.viewEditBookLists} />
      );
    } else if (this.state.view == baseListViews.CREATE_BASELISTS) {
      return (
        <CreateBaseList viewBaseLists={this.viewBaseLists}
                        allTags={this.props.allTags} />
      );
    } else if (this.state.view == baseListViews.EDIT_BASELISTS) {
      return (
        <EditBaseList viewBaseLists={this.viewBaseLists} baselist={this.state.baselist}/>
      );
    }
  }
});

module.exports = BaseListView;
