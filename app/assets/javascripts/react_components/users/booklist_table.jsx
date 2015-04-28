/** @jsx React.DOM */

var React = require('react');

/*
 * @prop booklist - the id of the booklist to display.
 * @prop editable - boolean for if this table is editable
 */
var BookListTable = React.createClass({
  getInitialState: function() {
    return {
      books: []
    };
  },
  _renderAddButton: function() {
    return (
      this.props.editable ?
          <a href={"/?booklist=" + this.props.booklist}>
            <div className="btn btn-default">
              <span className="glyphicon glyphicon-plus"/>
              <span className="add-books">Add Books</span>
            </div>
          </a>
      :
        null
    );
  },
  componentDidMount: function() {
    this.getBooks(this.props.booklist);
  },
  componentWillReceiveProps: function (nextProps) {
    this.getBooks(nextProps.booklist);
  },
  getBooks: function (booklistId) {
    $.ajax({
      url: "/api/v1/book_lists/" + booklistId + "/books",
      type: "GET",
      success: function(data) {
        this.setState({books: data});
      }.bind(this),
      error: function(xhr, status, err) {
        toastr.error("There was an error retrieving the book data.");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _downloadList: function() {
    $.ajax({
      url: "/api/v1/book_lists/" + this.props.booklist + "/csv",
      type: "GET",
      success: function(data) {
        window.open("data:text/csv;charset=utf-8," + escape(data));
      }.bind(this),
      error: function(xhr, status, error) {
        toastr.error("There was an error while generating the report");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _removeBook: function(book) {
    $.ajax({
      url: "/api/v1/book_lists/" + this.props.booklist + "/remove/" + book.id,
      type: "DELETE",
      dataType: "json",
      success: function(data) {
        var books = this.state.books;
        books.splice(books.indexOf(book), 1);
        this.setState({books: books});
        toastr.success(book.title + " was successfully removed.");
      }.bind(this),
      error: function(xhr, status, error) {
        toastr.error("There was an error removing the book.");
        console.error(this.props.url, status, error.toString());
      }
    });
  },
  _toggleFlag: function(book, isFlagged) {
    $.ajax({
      url: "/api/v1/book_lists/" + this.props.booklist + "/toggle_flag/",
      type: "POST",
      dataType: "json",
      data: {
        book_id: book.id,
        flagged: isFlagged,
        user_id: gon.current_user.id,
      },
      success: function(data) {
        var books = this.state.books;
        var index = books.indexOf(book);
        book.flagged_user_email = data.email;
        book.flagged_user_role = data.role;
        books.splice(index, 1, book);
        this.setState({books: books});
      }.bind(this),
      error: function(xhr, status, error) {
        toastr.error("There was an error flagging the book.");
        console.error(this.props.url, status, error.toString());
      }
    });
  },
  _renderValidationHeader: function() {
    var totalCount = this.state.books.length;
    var internationalCount = _.where(this.state.books, {book_type:false}).length;
    var africanCount = _.where(this.state.books, {book_type:true}).length;
    var notFlaggedCount = _.where(this.state.books, {flagged_user_email:null}).length;
    return (
      this.props.editable ?
        <div className="row">
          <div className="col-md-3">
            Total #: {totalCount}
          </div>
          <div className={"col-md-3" + ((internationalCount == africanCount) ? "" : " booklist-info-red")}>
            International #: {internationalCount}
          </div>
          <div className={"col-md-3" + ((internationalCount == africanCount) ? "" : " booklist-info-red")}>
            African #: {africanCount}
          </div>
          <div className="col-md-3">
            Flagged #: {this.state.books.length - notFlaggedCount}
          </div>
        </div>
      :
      null
    );
  },
  render: function() {
    var self = this;
    var books = this.state.books.map(function (book) {
      return (
        <BookListRow book={book}
                     removeBook={self._removeBook}
                     editable={self.props.editable}
                     flagged={book.flagged_user_email != null}
                     toggleFlag={self._toggleFlag}
                     key={book.id} />
      );
    });
    return (
      <div>
      {this._renderValidationHeader()}
        <div className="panel panel-primary">
          <div className="panel-heading">
            <div className="row">
              <div className="col-md-2">
                {this._renderAddButton()}
              </div>
              <div className="col-md-8 booklist-title">
                {this.props.name}
              </div>
              <div className="col-md-2">
                <div className="btn btn-default pull-right" onClick={this._downloadList}>
                  <span className="glyphicon glyphicon-download-alt"/>
                </div>
              </div>
            </div>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-md-12">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Book Name</th>
                      <th>Publisher</th>
                      <th>Genre</th>
                      <th>Book Type</th>
                      <th>Language</th>
                      <th>Country</th>
                      <th>Restricted</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {books}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

/*
 * @prop book - the book in JSON
 * @prop removeBook - a callback for when the remove button is clicked
 * @prop editable - a boolean for if the row should be editable
 * @prop toggleFlag - a function to call when the flag is clicked for this row.
 * @prop key - UNUSED
 */
var BookListRow = React.createClass({
  componentDidMount: function() {
    $('[data-toggle="tooltip"]').tooltip();
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.flagged != this.props.flagged) {
      $('[data-placement="left"]').tooltip("destroy");
      $('[data-toggle="tooltip"]').tooltip();
    }
  },
  _removeBook: function() {
    this.props.removeBook(this.props.book);
  },
  _toggleFlag: function() {
    this.props.toggleFlag(this.props.book, !this.props.flagged);
  },
  _renderRemove: function() {
    return (
      this.props.editable ?
        <span className="glyphicon glyphicon-remove remove" onClick={this._removeBook} />
      :
      null
    );
  },
  _renderFlag: function() {
    var flaggedClass = this.props.flagged ? "flagged" : "";
    var rowFlaggedClass = flaggedClass + "-" + this.props.book.flagged_user_role;
    var toggleFlag = gon.current_user.role != "user" ? this._toggleFlag : null;
    return (
      this.props.editable ?
        <td data-placement="left" onClick={toggleFlag}
          data-toggle={this.props.flagged ? "tooltip" : ""}
          data-original-title={"Flagged by: " + this.props.book.flagged_user_email} >
          <img className={"flag " + flaggedClass} src="/assets/flag.png" />
        </td>
      :
        null
    );
  },
  render: function() {
    var flaggedClass = this.props.flagged ? "flagged" : "";
    var rowFlaggedClass = flaggedClass + "-" + this.props.book.flagged_user_role;
    return (
      <tr className={rowFlaggedClass}>
        <td className="book-title-table">
          {this._renderRemove()}
          <a href={this.props.book.url} target="_blank">{this.props.book.title}</a>
        </td>
        <td>
          {this.props.book.publisher_name}
        </td>
        <td>
          {this.props.book.genre_name}
        </td>
        <td>
          {this.props.book.book_type ? "African" : "International"}
        </td>
        <td>
          {this.props.book.language_name}
        </td>
        <td>
          {this.props.book.country_name}
        </td>
        <td>
          Unknown
        </td>
        {this._renderFlag()}
      </tr>
    );
  }
});

module.exports = BookListTable;
