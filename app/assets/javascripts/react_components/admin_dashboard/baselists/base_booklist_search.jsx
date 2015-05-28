/** @jsx React.DOM */

var React = require('react');

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
        name: 'base_booklists',
        displayKey: 'text',
        source: this.props.allTags
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
          <div className="input-group input-bar">
            <input className="input-block-level form-control book-searchbar-input" onKeyUp={this.search} placeholder="Search for books" type="text" />
            <span className="input-group-btn">
              <button className="btn btn-default" id="search-button" onClick={this.updateSearch} type="button"><span className="glyphicon glyphicon-search"></span></button>
            </span>
          </div>
          <div className="input-group input-bar">
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-tag"/>
            </span>
            <input className="book-tagbar-input input-block-level typeahead form-control"
              placeholder="Add a Tag" type="text"/>
          </div>
        </div>
        <div className="input-group input-bar">
          <input id="description-field" className="input-block-level form-control book-searchbar-input"
            placeholder="Add a short description" type="text" />
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

module.exports = BaseBookListSearch;
