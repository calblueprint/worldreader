/** @jsx React.DOM */

var EditBaseList = React.createClass({
  getInitialState: function() {
    var baselist = this.props.baselist;
    return {
      bookTags: [],
      selectedBooks: [],
      name: baselist.name,
      published: baselist.published
    }
  },
  componentDidMount: function() {
    $('#baselist-toggle').bootstrapSwitch();
    $('#baselist-toggle').on('switchChange.bootstrapSwitch', this._togglePublished);
    $('.bootstrap-switch').css("float", "right");
    $('.name-field').val(this.state.name);

    $.ajax({
      url: "/api/v1/book_lists/" + this.props.baselist.id + "/books",
      type: "GET",
      success: function(data) {
        this.setState({selectedBooks: data});
      }.bind(this),
      error: function(xhr, status, err) {
        toastr.error("There was an error retrieving the book data.");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _togglePublished: function(event, state) {
    this.setState({published: state});
    $('#baselist-toggle').bootstrapSwitch();
  },
  _setBookTags: function(tags) {
    this.setState({bookTags: tags});
  },
  _selectBook: function (book) {
    var bookList = this.state.selectedBooks;
    if (_.findWhere(bookList, {"id":book.id}) == null) {
      bookList.push(book);
    }
    this.setState({selectedBooks: bookList});
  },
  _unselectBook: function(book) {
    var bookList = _.without(this.state.selectedBooks, book);
    this.setState({selectedBooks: bookList});
  },
  _editBaseList: function() {
    var bookIds = _.pluck(this.state.selectedBooks, "id");
    var name = $('.name-field').val();
    this.setState({name: name});

    // Client Side validations
    var errors = false;
    if (bookIds.length == 0) {
      toastr.error("No books selected.");
      errors = true;
    }

    if (name == "") {
      toastr.error("No name provided.");
      errors = true;
    }
    if (errors) return;

    $.ajax({
      type: "PATCH",
      url: "/api/v1/book_lists/"+this.props.baselist.id,
      data: {
        base_list: {
          name: name,
          book_ids: bookIds,
          published: this.state.published
        }
      },
      success: function() {
        toastr.success("Baselist succesfully edited.");
        this.props.viewBaseLists();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        toastr.error("Error editing baselist.");
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="btn-group btn-group-lg col-md-4" role="group">
            <div className="btn btn-default" onClick={this.props.viewBaseLists}>
              <span className="glyphicon glyphicon-chevron-left"></span> Back
            </div>
            <div className="btn btn-default" onClick={this._editBaseList}>
              Done
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group input-group-lg name-input-group">
              <input type="text" className="form-control name-field" placeholder="Enter a Baselist name"/>
            </div>
          </div>
          <div className="col-md-4">
            <input  type="checkbox"
                    id="baselist-toggle"
                    defaultChecked={this.state.published}
                    onSwitchChange={this._togglePublished}
                    data-on-text="Published"
                    data-off-text="Private"
                    data-on-color="success"
                    data-off-color="default"/>
          </div>
        </div>
        <div className="row top-buffer">
          <div className="col-md-12">
            <div className="panel">
              <h3 className="panel-title"> Book Tags </h3>
              <div className="panel-boundary-bottom"/>
              <BaseBookListSearch selectBook={this._selectBook} unselectBook={this._unselectBook} selectedBooks={this.state.selectedBooks}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
