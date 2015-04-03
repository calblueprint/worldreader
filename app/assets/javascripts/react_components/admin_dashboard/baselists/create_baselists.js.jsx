/** @jsx React.DOM */

var CreateBaseList = React.createClass({
  getInitialState: function() {
    return {
      bookTags: [],
      selectedBooks: [],
      name: "",
      published: 0
    }
  },
  componentDidMount: function() {
    $('#baselist-toggle').bootstrapSwitch();
    $('#baselist-toggle').on('switchChange.bootstrapSwitch', this._togglePublished);
    $('.bootstrap-switch').css("float", "right");
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
  _addBaseList: function() {
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
      type: "POST",
      url: "/api/v1/base_lists/",
      data: {
        base_list: {
          name: name,
          book_ids: bookIds,
          published: this.state.published
        }
      },
      success: function() {
        toastr.success("Baselist created.");
        this.props.viewBaseLists();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        toastr.error("Error creating baselist.");
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
            <div className="btn btn-default" onClick={this._addBaseList}>
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

var BaseBookListSearch = React.createClass({
  componentDidMount: function() {
    this._initTagbar();
  },
  getInitialState: function() {
    return {
      books: [],
      pageNumber: 0,
      isLastPage: true
    };
  },
  _initTagbar: function() {
    var mainSearch = $('.book-tagbar-input');
    mainSearch.tagsinput({
      tagClass: function(item) {
        switch (item.tagType) {
          case 'country':     return countryLabel;
          case 'levels':        return levelLabel;
          case 'language':      return languageLabel;
          case 'genre':         return genreLabel;
        }
      },
      itemValue: 'value',
      itemText: 'text',
      typeahead: {
        name: 'recommendations',
        displayKey: 'text',
        source: gon.all_tags
      }
    });
    mainSearch.on('itemAdded', this.tagsUpdated);
    mainSearch.on('itemRemoved', this.tagsUpdated);
  },
  tagsUpdated: function () {
    this.setState({books: [], pageNumber: 0});
    this.updateSearch();
  },
  search: function (event) {
    if (event.which == 13) {
      this.setState({books: [], pageNumber: 0});
      this.updateSearch();
    }
  },
  updateSearch: function () {
    var tags = $(".book-tagbar-input").tagsinput("items");
    var searchTerm = $(".book-searchbar-input").val();
    var self = this;
    var state = this._pendingState == null || this._pendingState == this.state ?
      this.state : this._pendingState;

    $.ajax({
      type: "GET",
      url: "/api/v1/books/search",
      dataType: "json",
      data: {
        tags: JSON.stringify(tags),
        term: searchTerm,
        page: state.pageNumber
      },
      success: function(results) {
        self.setState({ books: state.books.concat(results.books),
                        isLastPage: results.books.length == 0});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    if (tags.length == 0 && searchTerm=="") {
      this.setState({books: []});
    }
  },
  loadMore: function(pageToLoad) {
    this.setState({pageNumber: this.state.pageNumber + 1});
    this.updateSearch();
  },
  render: function() {
    var addBook = this.props.selectBook;
    var removeBook = this.props.unselectBook;
    var selectedBooks = this.props.selectedBooks;
    var bookList = this.state.books.map (function (book) {
      if (_.findWhere(selectedBooks, {"id": book.id}) == null) {
        return (
          <BaseBookListItem book={book} addBook={addBook} isSelected={false}/>
        );
      }
    });
    var selectedBookList = this.props.selectedBooks.map (function (book) {
      return (
        <BaseBookListItem book={book} removeBook={removeBook} isSelected={true}/>
      );
    });
    return (
      <div>
        <div className="row book-search-fields">
          <div id="book-searchbar" className="input-group">
            <input className="input-block-level form-control book-searchbar-input" onKeyUp={this.search} placeholder="Search for books" type="text" />
            <span className="input-group-btn">
              <button className="btn btn-default" id="search-button" onClick={this.updateSearch} type="button"><span className="glyphicon glyphicon-search"></span></button>
            </span>
          </div>
          <div id="book-tagbar" className="input-group">
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-tag"/>
            </span>
            <input className="book-tagbar-input input-block-level typeahead form-control" placeholder="Add a Tag" type="text"/>
          </div>
        </div>
        <div className="row book-search-rows">
          <div className="book-search-panel-left">
            <ul className="book-search-list">
              <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore}
                hasMore={!this.state.isLastPage}
                threshold={250}
                load={<div className="loader">Loading...</div>}>
                  {bookList}
              </InfiniteScroll>
            </ul>
          </div>
          <div className="book-search-panel-right">
            <ul className="book-search-list">
              {selectedBookList}
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

var BaseBookListItem = React.createClass({
  addBookToSelected: function () {
    var selectBook = this.props.addBook;
    selectBook(this.props.book);
  },
  removeBookFromSelected: function () {
    var unselectBook = this.props.removeBook;
    unselectBook(this.props.book);
  },
  render: function () {
    if (!this.props.isSelected) {
      return (
        <li key={this.props.book.id}> {this.props.book.title}
          <a onClick={this.addBookToSelected}><span className="glyphicon glyphicon-plus book-search-li-icon"/></a>
        </li>
      );
    } else {
      return (
        <li key={this.props.book.id}> {this.props.book.title}
          <a onClick={this.removeBookFromSelected}><span className="glyphicon glyphicon-minus book-search-li-icon"/></a>
        </li>
      );
    }
  }
});