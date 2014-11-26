/** @jsx React.DOM */

// Cart Variables
var ADD_BOOK_TO_CART = "add";
var REMOVE_BOOK_FROM_CART = "remove";
var SEE_MORE_CART_ITEMS = "see more";
var NUM_VISIBLE_CART_ITEMS = 5;

var CheckoutButton = React.createClass({
  buttonPressed: function() {
    if (isPurchaseable()) {
      makePurchase();
    } else {
      toastr.error("To complete a purchase, you need to have an equal number of paid and donated books!");
    }
  },
  render: function() {
    return (
      <button className="btn btn-primary checkout-btn" onClick={this.buttonPressed}>
        Checkout
      </button>
    );
  }
});

var CartItem = React.createClass({
  cartItemRemoved: function(event) {
    this.props.handleCartEvent(this.props.book);
    $('#cart-item').on({
      "shown.bs.dropdown": function() { this.closable = false; },
      "click":             function() { this.closable = false; },
      "hide.bs.dropdown":  function() { return true; }
    });
  },
  render: function() {
    return (
      <div className="cart-item">
        <a className="close" onClick={this.cartItemRemoved} >&times;</a>
        {this.props.book.name}
      </div>
    );
  }
});

var Cart = React.createClass({
  getInitialState: function() {
    return {cart: cart,
            user: gon.current_user,
            numVisibleCartItems: NUM_VISIBLE_CART_ITEMS};
  },
  viewMoreClicked: function(event) {
    this.props.handleCartEvent({SEE_MORE_CART_ITEMS: 1});
  },
  componentWillMount: function() {
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    cart.on("change", this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
    cart.off("change", this._boundForceUpdate);
  },
  removeBookFromCart: function(book) {
    removeBook(book, this.state.user.id);
  },
  render: function() {
    var cartItems = cart.get("items");
    var displayCart = _.last(cartItems, this.state.numVisibleCartItems).reverse();
    var viewMore;
    if (cartItems.length > this.state.numVisibleCartItems) {
      viewMore = (
        <a onClick={this.viewMoreClicked}>View More</a>
      );
    }
    var books = displayCart.map(function(book) {
      return (
        <div className="cart-header-item">
          <CartItem book={book}
                    handleCartEvent={this.removeBookFromCart} />
        </div>
      );
    }.bind(this));
    return (
      <div>
        {books}
        {viewMore}
      </div>
    );
  }
});

var CartHeader = React.createClass({
  componentWillMount: function() {
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    cart.on("change", this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
    cart.off("change", this._boundForceUpdate);
  },
  render: function() {
    var cartItems = cart.get("items");
    return (
      <span>
        Cart ({cartItems.length})
        <span class="caret"></span>
      </span>
    );
  }
});
