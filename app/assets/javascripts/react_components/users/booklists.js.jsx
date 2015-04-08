/** @jsx React.DOM */

var BookLists = React.createClass({
  getInitialState: function () {
    return {
      bookLists: this.props.booklists,
      selectedBookList: this.props.booklists[0]
    }
  },
  selectBookList: function (booklist) {
    this.setState({selectedBookList: booklist});
  },
  render: function () {
    var self = this;
    var booklists = this.state.bookLists.map (function (booklist) {
      var select = function () {
        self.selectBookList(booklist);
      };
      return (
        <li role="presentation"><a role="menuitem" tabIndex="-1" href="#" onClick={select}>{booklist.name}</a></li>
      );
    });
    return (
      <div className="container">
        <div className="dropdown booklist-select">
          <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
            {this.state.selectedBookList.name}
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
            {booklists}
          </ul>
        </div>
        <BookListTable booklist={this.state.selectedBookList.id}/>
      </div>
    );
  }
});
