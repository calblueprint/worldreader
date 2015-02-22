/** @jsx React.DOM */

var BookStatusView = React.createClass({
  getInitialState: function() {
    return {
      books: [],
      page: 1,
      isLastPage: false
    };
  },
  componentDidMount: function() {
    this.setState({
      books: [],
      page: 1,
      isLastPage: false
    });
    $.ajax({
      url: "/api/v1/books",
      dataType: "json",
      success: function(data) {
        this.setState({books: data})
      }.bind(this),
      error: function(xhr, status, err) {
        toastr.error("There was an error retrieving the book data.");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadMore: function(pageToLoad) {
    $.ajax({
      url: "/api/v1/books",
      dataType: "json",
      data: {
        page: pageToLoad
      },
      success: function(data) {
        this.setState({ books: this.state.books.concat(data),
                        page: this.state.page + 1,
                        isLastPage: data.length == 0});
      }.bind(this),
      error: function(xhr, status, err) {
        toastr.error("There was an error retrieving the book data.");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var bookStatuses = this.state.books.map(function (book) {
      return (
        <BookStatus book={book}
                    key={book.id} />
      );
    });
    return (
      <div  className="container">
        <div className="panel panel-primary">
          <div className="row">
            <div className="col-md-12">
              <InfiniteScroll
                pageStart={1}
                loadMore={this.loadMore}
                hasMore={!this.state.isLastPage}
                loader={<div className="loader">Loading...</div>}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Book Name</th>
                        <th>Updated On</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookStatuses}
                    </tbody>
                  </table>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var BookStatus = React.createClass({
  render: function() {
    var status = (
      <span className="label label-success">OK</span>
    );
    // the presense of an update status means there was a failure
    if (this.props.book.update_status) {
      status = (
        <span className="label label-danger">
          Failed
        </span>
      );
    }
    return (
      <tr>
        <td>
          <a href={this.props.book.url}>{this.props.book.title}</a>
        </td>
        <td>
          {this.props.book.updated_at}
        </td>
        <td>
          {status}
        </td>
      </tr>
    );
  }
});
