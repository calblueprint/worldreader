/** @jsx React.DOM */

/* 
 * @prop booklist - the id of the booklist to display. 
 */
var BookListTable = React.createClass({
  getInitialState: function() {
    return {
      books: []
    };
  },
  componentDidMount: function() {
    $.ajax({
      url: "/api/v1/book_lists/" + this.props.booklist + "/books",
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
  downloadList: function() {
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
  render: function() {
    var books = this.state.books.map(function (book) {
      return (
        <BookListRow book={book}
                     key={book.id} />
      );
    });
    return (
      <div  className="container">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <div className="row">
              <div className="col-md-12">
                <div className="btn btn-default pull-right" onClick={this.downloadList}>
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
 * @prop key - UNUSED
 */
var BookListRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td className="book-title-table">
          <a href={this.props.book.url}>{this.props.book.title}</a>
        </td>
        <td>
          {this.props.book.publisher_name}
        </td>
        <td>
          {this.props.book.genre_name}
        </td>
        <td>
          Unknown
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
      </tr>
    );
  }
});
