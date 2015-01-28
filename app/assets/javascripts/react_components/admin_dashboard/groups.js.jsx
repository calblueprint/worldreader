/** @jsx React.DOM */

var GroupDisplay = React.createClass({
  getInitialState: function () {
    var initGroup = {
      name: "",
      country: "",
      description: "",
      id: "",
    };
    return {groups: [initGroup]};
  },
  componentDidMount: function () {
    this._fetchGroups({id: this.props.partnerId});
  },
  _fetchGroups: function (id) {
    $.ajax({
      url: "/admin/dashboard/" + id["id"] + "/display_groups",
      dataType: 'json',
      data: id,
      success: function (data) {
        console.log(data);
        this.setState({groups: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.log("error");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var allGroups = this.state.groups.map (function (group) {
      return (
        <Group group={group} />
      );
    });
    return (
      <div>
        {allGroups}
      </div>
    );
  }
});

var Group = React.createClass({
  getInitialState: function () {
    return {expand: "Show Books"};
  },
  _expand: function () {
    if (this.state.expand == "Show Books") {
      this.setState({expand: "Hide Books"});
    } else {
      this.setState({expand: "Show Books"});
    }
  },
  render: function () {
    return (
      <div className="well">
        <div className="groupInfo">
          <h2> {this.props.group["name"]} </h2>
          <div> Country: {this.props.group["country"]} </div>
          <div> Description: {this.props.group["organization"]} </div>
        </div>
        <div className="groupExpand">
          <button className="btn btn-default dropdown-toggle" type="button"
            data-toggle="dropdown" aria-expanded="true" onClick={this._expand} >
            {this.state.expand}
            { this.state.expand == "Hide Books" ? <span className="caret caret-reversed">
              </span> : <span className="caret"></span>}
          </button>
        </div>
        {this.state.expand == "Hide Books" ? <GroupBooks groupId={this.props.group["id"]}/> : null}
      </div>
    );
  }
});

var GroupBooks = React.createClass({
  getInitialState: function () {
    return {books: []};
  },
  componentDidMount: function () {
    this._fetchBooks({id: this.props.groupId});
  },
  _fetchBooks: function (id) {
    $.ajax({
      url: "/admin/dashboard/" + id["id"] + "/display_books",
      dataType: 'json',
      data: id,
      success: function (data) {
        console.log(data);
        this.setState({books: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    console.log(this.state.books);
    return (
      <div>
        <GroupBookList books={this.state.books} />
      </div>
    );
  }
});

var GroupBookList = React.createClass({
  render: function() {
    var books = this.props.books.map(function (book) {
      return (
        <div className="book">
          {book.title}
        </div>
      );
    }.bind(this));
    return (
      <div className="groupBooks">
        {books}
      </div>
    );
  }
});
