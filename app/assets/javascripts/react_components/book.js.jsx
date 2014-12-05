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
    if (_.findWhere(this.props.cart, {id: this.props.book.id})) {
      return (
        <button className="btn cart-button" onClick={this.handleClick}>
        Remove from Cart
        </button>
      )
    } else {
      return (
        <button className="btn cart-button" onClick={this.handleClick}>
        Add to Cart
        </button>
      )
    }
  }
});

var BookList = React.createClass({
  getInitialState: function() {
    return {cart: cart,
            user: gon.current_user,
            books: this.props.books,
            expandedBookId: null};
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
  render: function() {
    bookList = this;
    var bookTiles = this.state.books.map(function (book) {
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
    }.bind(this));

    if (bookTiles.length) {
      return (
        <div className="media-list">
          {bookTiles}
        </div>
      );
    } else {
      return (
        <div className="media-list col-md-8 col-md-offset-2">
          <h3 className="text-center">
            No books found. Search for a title or add a tag to continue.
          </h3>
        </div>
      );
    }
  }
});
