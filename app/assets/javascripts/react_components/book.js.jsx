/** @jsx React.DOM */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var bookList = null;

var CartButton = React.createClass({
  handleClick: function(event) {
    if (_.findWhere(this.props.cart, {id: this.props.book.id})) {
      this.props.onClick({REMOVE_BOOK_FROM_CART: this.props.book});
    } else {
      this.props.onClick({ADD_BOOK_TO_CART: this.props.book});
    }
  },
  render: function() {
    if (_.contains(this.props.user.past_purchase_ids, this.props.book.id)) {
      return (
        <button className="btn cart-button disabled">
          You have already purchased this book!
        </button>
      );
    }
    if (_.findWhere(this.props.cart, {id: this.props.book.id})) {
      return (
        <button className="btn cart-button" onClick={this.handleClick}>
        Remove from Cart
        </button>
      );
    } else {
      return (
        <button className="btn cart-button" onClick={this.handleClick}>
        Add to Cart
        </button>
      );
    }
  }
});

var BookList = React.createClass({
  getInitialState: function() {
    return {cart: cart,
            user: gon.current_user,
            books: this.props.books,
            expandedBookId: null,
            pageNumber: 0,
            searchTerm: "",
            tags: [],
            isLastPage: false};
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
    cart.on("change", this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
    cart.off("change", this._boundForceUpdate);
  },
  componentDidMount: function() {
    this.initTagbar();
    $('[data-toggle="tooltip"]').tooltip({
      title: "Search by tags, which can be reading levels, genre, countries, or language.",
    });
  },
  handleBooksUpdate: function(event) {
    this.setState({books: event});
  },
  handleCartEvent: function(event) {
    if (event.REMOVE_BOOK_FROM_CART) {
      var book = event.REMOVE_BOOK_FROM_CART;
      this.setState(
        {numVisibleCartItems:
          _.min([NUM_VISIBLE_CART_ITEMS, cart.get("items").length])
        });
      removeBook(book, this.state.user.id);
      if (this.props.small) {
        var books = _.reject(this.state.books, function(el) {
          return el.id == book.id;
        });
        this.setState({books: books});
      }
    } else if (event.ADD_BOOK_TO_CART) {
      var book = event.ADD_BOOK_TO_CART;
      addBook(book, this.state.user.id);
    } else if (event.SEE_MORE_CART_ITEMS) {
      this.setState({numVisibleCartItems:
                    _.min([this.state.numVisibleCartItems + NUM_VISIBLE_CART_ITEMS,
                          cart.get("items").length])});
    }
  },
  initTagbar: function() {
    if (!this.props.small) {
      var mainSearch = $('#book-tagbar-input');
      mainSearch.tagsinput({
        tagClass: function(item) {
          switch (item.tagType) {
            case 'country':       return countryLabel;
            case 'levels':        return levelLabel;
            case 'language':      return languageLabel;
            case 'genre':         return genreLabel;
            case 'subcategory':   return subcategoryLabel;
            case 'recommended':   return recommendedLabel;
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
    }
  },
  generateTile: function(book) {
    if (this.props.small) {
      return (
        <SmallBookTile
          user={gon.current_user}
          key={book.id}
          book={book}
          cart={cart.get("items")}
          handleCartEvent={this.handleCartEvent} />
      )
    }
    return (
      <BookTile
        user={gon.current_user}
        key={book.id}
        book={book}
        cart={cart.get("items")}
        handleClick={this.handleBookExpand}
        handleCloseButton={this.handleBookClosed}
        handleCartEvent={this.handleCartEvent}
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
    var searchBar = (
      <div className="row" id="library">
        <div id="tag-and-searchbar">
          <div className="input-group" id="book-searchbar">
            <input className="input-block-level form-control" id="book-searchbar-input" onKeyUp={this.search} placeholder="Search for books" type="text" />
            <span className="input-group-btn">
              <button className="btn btn-default" id="search-button" onClick={this.search} type="button"><span className="glyphicon glyphicon-search"></span></button>
            </span>
          </div>
          <div className="input-group" id="book-tagbar">
            <span className="input-group-addon"><span className="glyphicon glyphicon-tag"></span></span>
            <input className="input-block-level typeahead form-control" id="book-tagbar-input" placeholder="Add tag" type="text" />
            <span className="input-group-addon"><span className="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="left"></span></span>
          </div>
        </div>
      </div>
    );
    if (bookTiles.length) {
      var results = ""
      if (!this.props.small) {
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
      } else {
        return (
          <div>
            <div className="search-results">
              <h4 className="current-search text-center">
                {results}
              </h4>
              {bookTiles}
            </div>
          </div>
        );
      }
    }
    return (
      <div>
        {this.props.small ? null : searchBar}
        <div className="media-list col-md-8 col-md-offset-2">
          <h3 className="text-center">
            No books found. Search for a title or add a tag to continue.
          </h3>
        </div>
      </div>
    );
  }
});
