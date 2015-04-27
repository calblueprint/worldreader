/** @jsx React.DOM */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var bookList = null;

var BookList = React.createClass({
  getInitialState: function() {
    return {user: gon.current_user,
            books: this.props.books,
            expandedBookId: null,
            pageNumber: 0,
            searchTerm: "",
            tags: JSON.parse(this.props.tags),
            isLastPage: false
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
    $('.selectpicker').selectpicker('val', this.props.booklist);
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
          for (var error of errors) {
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
          case 'levels':        return levelLabel;
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
        source: gon.all_tags
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
        user={gon.current_user}
        key={book.id}
        book={book}
        handleClick={this.handleBookExpand}
        handleCloseButton={this.handleBookClosed}
        addBook={this.addBook}
        isExpanded={this.state.expandedBookId === book.id} />
    );
  },
  loadMore: function(pageToLoad) {
    this.setState({pageNumber: this.state.pageNumber + 1});
    this.updateSearch();
  },
  tagsUpdated: function() {
    this.setState({ books: [],
                  pageNumber: 0,
                  isLastPage: true});
    this.updateSearch()
  },
  search: function(event) {
    if (event.which == 13) {
      this.setState({ books: [],
                    pageNumber: 0,
                    isLastPage: true});
      this.updateSearch();
    }
  },
  updateSearch: function() {
    var searchTerm = $("#book-searchbar-input").val();
    var tags = $("#book-tagbar-input").tagsinput("items");
    this.setState({ searchTerm: searchTerm,
                    tags: tags});
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
        self.setState({books: state.books.concat(results.books),
                       isLastPage: results.books.length == 0});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    bookList = this;
    var bookTiles = this.state.books.map(function (book) {
      return this.generateTile(book);
    }.bind(this));
    var booklists = gon.booklists.map(function(booklist) {
      return (
        <option value={booklist.id}>{booklist.name}</option>
      );
    }.bind(this));
    var tagbarWidth = (gon.current_user == null) ? "col-md-10" : "col-md-8";
    var searchBar = (
      <div className="row" id="library">
        <div id="tag-and-searchbar">
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <div className="input-group" id="book-searchbar">
                <input className="input-block-level form-control" id="book-searchbar-input" onKeyUp={this.search} placeholder="Search for books" type="text" />
                <span className="input-group-btn">
                  <button className="btn btn-default" id="search-button" onClick={this.search} type="button"><span className="glyphicon glyphicon-search"></span></button>
                </span>
              </div>
            </div>
          </div>
          <div className="row tagbar-booklists">
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
              {gon.current_user != null ?
                <div className="col-md-2">
                  <div className="booklists-select">
                    <select className="selectpicker booklists" title="Select a Booklist"
                      data-width="100%" multiple data-size="20" data-live-search="true"
                      data-selected-text-format="count>4">
                      {booklists}
                    </select>
                  </div>
                </div>
               : null
              }
            </div>
          </div>
        </div>
      </div>
    );
    if (bookTiles.length) {
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
      results = "Found results:" + searchString + tagString + ".";
      return (
        <div>
          {searchBar}
          <div className="search-results">
            <h4 className="current-search text-center">
              {results}
            </h4>
            <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={!this.state.isLastPage}
              threshold={250}
              loader={<div className="loader">Loading...</div>}>
                <div className="media-list">
                  {bookTiles}
                </div>
            </InfiniteScroll>
          </div>
        </div>
      );
    }
    return (
      <div>
        {searchBar}
        <div className="media-list col-md-8 col-md-offset-2">
          <h3 className="text-center">
            No books found. Search for a title or add a tag to continue.
          </h3>
        </div>
      </div>
    );
  }
});
