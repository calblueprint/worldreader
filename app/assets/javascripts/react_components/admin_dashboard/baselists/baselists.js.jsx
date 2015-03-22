/** @jsx React.DOM */

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
        <CreateBaseList viewBaseLists={this.viewBaseLists} />
      );
    } else if (this.state.view == baseListViews.EDIT_BASELISTS) {
      return (
        <EditBaseList viewBaseLists={this.viewBaseLists} />
      );
    }
  }
});

var BaseLists = React.createClass({
  getInitialState: function() {
    return {baseLists: [],
      selectedBaselist: null};
  },
  componentDidMount: function() {
    this._fetchBaseLists();
  },
  _fetchBaseLists: function() {
    $.ajax({
      url: "/api/v1/base_lists/",
      dataType: "json",
      success: function(data) {
        this.setState({baseLists: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _selectBaselist: function(id) {
    if (id == this.state.selectedBaselist) {
      this.setState({selectedBaselist: null});
    } else {
      this.setState({selectedBaselist: id});
    }
  },
  _createBaseList: function() {
    this.props.viewCreateBookLists();
  },
  render: function() {
    var self = this;
    var pills = this.state.baseLists.map(function(baselist) {
      return (
        <BaseList baselist={baselist}
          clicked={_.isEqual(self.state.selectedBaselist, baselist.id)}
          selectBaselist={self._selectBaselist}
          editBaseList={self.props.viewEditBookLists} />
      );
    });
    return (
      <div className="container">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <div className="row">
              <div className="col-md-12">
                <div className="btn btn-default pull-right" onClick={this._createBaseList}><span className="glyphicon glyphicon-plus"/></div>
              </div>
            </div>
          </div>
          <div className="panel-body">
            <div className="list-group">
              {pills}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var BaseList = React.createClass({
  componentDidMount: function() {
    this._bookList();
  },
  _bookList: function() {
    $.ajax({
      url: "/api/v1/base_lists/" + this.props.baselist.id + "/books",
      dataType: "json",
      success: function(data) {
        this.setState({books: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _published: function() {
    if (this.props.baselist.published) {
      return (
        <span className="label label-primary published-tag">Published</span>
      );
    }
  },
  onClick: function() {
    this.props.selectBaselist(this.props.baselist.id);
  },
  render: function() {
    if (this.props.clicked) {
      var books = this.state.books.map(function(book) {
        return (
          <li>
            {book.title}
          </li>
        );
      });
      return (
        <div className="list-group-item" onClick={this.onClick}>
          {this.props.baselist.name}
          {this._published()}
          <div className="btn-group pull-right">
            <button type="button" className="btn btn-default" onClick={this._editBaselist}>
              Edit
            </button>
            <button type="button" className="btn btn-default" 
              onClick={this._removeBaselist}>
              <div className="glyphicon glyphicon-remove"/>
            </button>
          </div>
          <ul>
            {books}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="list-group-item">
          <a href="#" onClick={this.onClick}>
            {this.props.baselist.name}
          </a>
          {this._published()}
        </div>
      );
    }
  }
})
