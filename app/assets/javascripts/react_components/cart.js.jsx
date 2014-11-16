/** @jsx React.DOM */

// Cart Variables
var ADD_BOOK_TO_CART = "add";
var REMOVE_BOOK_FROM_CART = "remove";
var SEE_MORE_CART_ITEMS = "see more";
var NUM_VISIBLE_CART_ITEMS = 5;

var CartItem = React.createClass({
  cartItemRemoved: function(event) {
    this.props.handleCartEvent(this.props.book.id);
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
            numVisibleCartItems: NUM_VISIBLE_CART_ITEMS};
  },
  viewMoreClicked: function(event) {
    this.props.handleCartEvent({SEE_MORE_CART_ITEMS: 1});
  },
  componentWillMount: function() {
    cart.on("change", (function() {
      this.forceUpdate();
    }.bind(this)));
  },
  componentWillUnmount: function() {
    cart.off("change");
  },
  removeBookFromCart: function(bookId) {
    // TODO figure out how to refactor this
    $.ajax({
      type: "POST",
      url: "/api/v1/carts/remove/" + bookId,
      data: {
        book_id: bookId,
        user_id: gon.current_user.id
      }
    }).done(function(message) {
      console.log("Received response " + message.message);
    });
    var cartItems = _.reject(cart.get("items"), function(el) {
      return el.id == bookId;
    });
    cart.set("items", cartItems);
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
        <div>
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
    cart.on("change", (function() {
      this.forceUpdate();
    }.bind(this)));
  },
  componentWillUnmount: function() {
    cart.off("change");
  },
  render: function() {
    var cartItems = cart.get("items");
    return (
      <div>
        Cart ({cartItems.length})
      </div>
    );
  }
});
