/** @jsx React.DOM */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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

var BookTile = React.createClass({
  handleClick: function() {
    this.props.handleClick({bookId: this.props.book.id});
  },
  render: function() {
    var content;
    if (this.props.isExpanded) {
      content = this.renderExpanded();
    } else {
      content = this.renderCollapsed();
    }
    return (
      <ReactCSSTransitionGroup transitionName={this.props.isExpanded ? "expand" : "collapse"} >
        {content}
      </ReactCSSTransitionGroup>
    )
  },
  renderExpanded: function() {
    var cartButton;
    if (this.props.user) {
      cartButton = (
        <CartButton user={this.props.user}
                    onClick={this.props.handleCartEvent}
                    cart={this.props.cart}
                    book={this.props.book} />
      )
    }
    return (
      <div key={this.props.book.id + "-expanded"} className="expanded-book-tile">
        <div className="close book-tile-close" onClick={this.props.handleCloseButton}>&times;</div>
        <div className="expanded-book-img-box pull-left">
          <img className="expanded-book-img" src={this.props.book.image} />
        </div>
        <div className="media-body">
          <h4 className="media-heading">{this.props.book.name}</h4>
          <span className="expanded-book-desc">{this.props.book.description}</span>
          {cartButton}
        </div>
      </div>
    )
  },
  renderCollapsed: function() {
    return (
      <div key={this.props.book.id + "-collapsed"} className="collapsed-book-tile"
          onClick={this.handleClick}>
        <div className="collapsed-book-img-box pull-left">
          <img className="collapsed-book-img" src={this.props.book.image} />
        </div>
        <div className="media-body">
          <h4 className="media-heading">{this.props.book.name}</h4>
          <span className="collapsed-book-desc">{this.props.book.description}</span>
        </div>
      </div>
    )
  }
});

var BookList = React.createClass({
  getInitialState: function() {
    return {cart: cart,
            user: gon.current_user,
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
  handleCartEvent: function(event) {
    if (event.REMOVE_BOOK_FROM_CART) {
      var book = event.REMOVE_BOOK_FROM_CART;
      this.setState({numVisibleCartItems:
                    _.min([NUM_VISIBLE_CART_ITEMS,
                          cart.get("items").length])});
      removeBook(book, this.state.user.id);
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
    var bookTiles = this.props.books.map(function (book) {
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
    return (
      <div className="media-list col-md-8 col-md-offset-2">
        {bookTiles}
      </div>
    );
  }
});
