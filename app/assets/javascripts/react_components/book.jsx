/** @jsx React.DOM */

var React = require('react');

var bookList = null;

var BookList = React.createClass({
  getInitialState: function() {
    return {
      books: this.props.books,
      expandedBookId: null,
      pageNumber: 0,
      searchTerm: "",
      tags: JSON.parse(this.props.tags),
      isLastPage: false,
      isFirstLoad: true,
      sortFilter: "_score",
      searching: false
    };
  },
  handleBookExpand: function(event) {
    var expandedBookId = event.bookId;
    this.setState({expandedBookId: expandedBookId});
  },
  handleBookClosed: function(event) {
    this.setState({expandedBookId: null});
  },
  componentWillMount: function() {
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
  },
  componentDidMount: function() {
    this.initTagbar();
    $('.selectpicker').selectpicker();
    $('#booklists-picker').selectpicker('val', this.props.booklist);
  },
  componentDidUpdate: function() {
    $('.selectpicker').selectpicker();
    $('#sort-filter').on('change', this.filterChanged);
  },
  handleBooksUpdate: function(event) {
    this.setState({books: event});
  },
  addBook: function(book) {
    var booklist_ids = $('.selectpicker').val();
    if (booklist_ids == null) {
      toastr.error("At least one booklist must be selected");
    } else {
      $.ajax({
        type: "POST",
        url: "/api/v1/book_lists/add/" + book.id,
        dataType: "json",
        data: {
          booklist_ids: booklist_ids,
        },
        success: function(response) {
          toastr.success(book.title + " was successfully added to your booklists!");
        }.bind(this),
        error: function(xhr, status, err) {
          var errors = xhr.responseJSON.errors;
          for (var error in errors) {
            toastr.error(error);
          }
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  },
  initTagbar: function() {
    var mainSearch = $('#book-tagbar-input');
    mainSearch.tagsinput({
      tagClass: function(item) {
        switch (item.tagType) {
          case 'country':       return countryLabel;
          case 'levels':         return levelLabel;
          case 'language':      return languageLabel;
          case 'genre':         return genreLabel;
          case 'subcategory':   return subcategoryLabel;
        }
      },
      itemValue: 'value',
      itemText: 'text',
      typeahead: {
        name: 'cities',
        displayKey: 'text',
        source: this.props.all_tags
      }
    });
    mainSearch.on('itemAdded', this.tagsUpdated);
    mainSearch.on('itemRemoved', this.tagsUpdated);
    $('#tag-and-searchbar').affix({
        offset: {
          top: $('#index-image').height()
        }
    });
    this.state.tags.map (function (tag) {
      mainSearch.tagsinput('add', tag);
    });
  },
  generateTile: function(book) {
    return (
      <BookTile
        user={this.props.current_user}
        key={book.id}
        book={book}
        handleClick={this.handleBookExpand}
        handleCloseButton={this.handleBookClosed}
        addBook={this.addBook}
        isExpanded={this.state.expandedBookId === book.id} />
    );
  },
  loadMore: function(pageToLoad) {
    if (!this.state.searching) {
      this.setState({pageNumber: this.state.pageNumber + 1});
      this.updateSearch(false);
    }
  },
  tagsUpdated: function() {
    this.setState({ books: [],
                  pageNumber: 0,
                  isLastPage: true});
    this.updateSearch(true)
  },
  keyboardSearchHandler: function(event) {
    if (event.which == 13) {
      this.updateSearch(true)
    }
  },
  search: function() {
    this.updateSearch(true)
  },
  updateSearch: function(resetSearch) {
    var searchTerm = $("#book-searchbar-input").val();
    var tags = $("#book-tagbar-input").tagsinput("items");
    if (tags.itemsArray) tags = tags.itemsArray;
    if (!searchTerm && tags.length == 0) return;
    this.setState({ searchTerm: searchTerm,
                    tags: tags,
                    isFirstLoad: false,
                    searching: resetSearch});
    var self = this;
    var state = this.state;
    $.ajax({
      type: "GET",
      url: "/api/v1/books/search",
      dataType: "json",
      context: this,
      data: {
        tags: JSON.stringify(tags),
        term: searchTerm,
        page: this.state.pageNumber,
        sort: this.state.sortFilter
      },
      success: function(results) {
        this.setState({
            isLastPage: results.books.length == 0,
            count: results.count,
            searching: false
        });
        if (resetSearch) {
          this.setState({ books: results.books,
                          pageNumber: 0});
        }
        else {
          this.setState({books: this.state.books.concat(results.books)});
        }
      },
      error: function(xhr, status, err) {
        this.setState({searching: false});
        console.error(this.props.url, status, err.toString());
      }
    });
  },
  filterChanged: function() {
    if (!this.state.searching) {
      this.setState({sortFilter: $("#sort-filter").val()});
      this.updateSearch(true);
    }
  },
  renderSortBy: function() {
    return (
      <div className="row sort-by">
        <div className="col-md-4">
          Sort by:
          <select id="sort-filter" className="selectpicker">
            <option value="_score">Relevance</option>
            <option value="title">Title</option>
            <option value="levels_name">Reading Level</option>
            <option value="country_name">Country</option>
            <option value="language_name">Language</option>
            </select>
        </div>
      </div>
    )
  },
  render: function() {
    bookList = this;
    var bookTiles = this.state.books.map(function (book) {
      return this.generateTile(book);
    }.bind(this));
    var booklists = this.props.user_booklists.map(function(booklist) {
      return (
        <option value={booklist.id}>{booklist.name}</option>
      );
    }.bind(this));
    var tagbarWidth = (this.props.current_user == null) ? "col-md-10" : "col-md-8";
    var searchBar = (
      <div id="tag-and-searchbar">
        <div className="col-md-10 col-md-offset-1">
          <div className="input-group" id="book-searchbar">
            <input className="input-block-level form-control"
              id="book-searchbar-input"
              onKeyUp={this.keyboardSearchHandler}
              placeholder="Search for books" type="text" />
            <span className="input-group-btn">
              <button className="btn btn-default"
                id="search-button" onClick={this.search}
                type="button">
                <span className="glyphicon glyphicon-search"></span>
              </button>
            </span>
          </div>
        </div>
        <div className="tagbar-booklists">
          <div className={tagbarWidth + " col-md-offset-1"}>
            <div className="input-group" id="book-tagbar">
              <span className="input-group-addon"><span className="glyphicon glyphicon-tag"></span></span>
              <input className="input-block-level typeahead form-control" id="book-tagbar-input" placeholder="Add tag" type="text" />
              <span className="input-group-btn">
                <button className="btn btn-default" id="search-button" type="button" data-toggle="modal" data-target="#HelpModal"><span className="glyphicon glyphicon-question-sign"></span></button>
              </span>
            </div>
          </div>
          <div className="select-container">
            {this.props.current_user != null ?
              <div className="col-md-2">
                <select className="selectpicker booklists" id="booklists-picker" title="Select a Booklist"
                  data-width="100%" multiple data-size="20" data-live-search="true"
                  data-selected-text-format="count>4">
                  {booklists}
                </select>
              </div>
              : null
            }
          </div>
        </div>
      </div>
    );
    var altView = this.state.isFirstLoad ?
                      "Begin by entering your search terms in the \
                      Search for books or Add tag field above. \
                      For a list of tags, click the question mark." :
                      "No books found. Continue by entering your \
                      search terms in the Search for books or \
                      Add tag field above. For a list of tags, \
                      click the question mark.";

    altView = this.state.searching ? <LoadingIndicator /> : altView;
    if (bookTiles.length && !this.state.searching) {
      var results = ""
      var searchString = " " + this.state.searchTerm;
      var tagsArray = this.state.tags;
      var tagText = [];
      for (var i = 0; i < tagsArray.length; i++) {
        tagText.push(tagsArray[i].text);
      }
      var tagString = "";
      if (tagText.length != 0){
        tagString = " with tags " + tagText.join(', ');
      }
      results = "Found " + this.state.count + " results:" + searchString + tagString + ".";
      return (
        <div>
          {searchBar}
          <div className="search-results">
            <div className="col-md-offset-1">
              {this.renderSortBy()}
            </div>
            <h4 className="current-search text-center">
              {results}
            </h4>
            <div className="col-md-10 col-md-offset-1">
              <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore}
                hasMore={!this.state.isLastPage}
                threshold={250}
                loader={<LoadingIndicator />}>
                <div className="media-list">
                  {bookTiles}
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        {searchBar}
        <div className="media-list col-md-8 col-md-offset-2">
          <h3 className="text-center">
            {altView}
          </h3>
        </div>
      </div>
    );
  }
});

module.exports = BookList;
