/** @jsx React.DOM */

var CartItem = React.createClass({
  cartItemRemoved: function(event) {
    this.props.handleCartEvent({REMOVE_BOOK_FROM_CART: this.props.book});
  },
  render: function() {
    return (
      <div className="cart-item">
        <a className="close" onClick={this.cartItemRemoved}>&times;</a>
        {this.props.book.name}
      </div>
    );
  }
});

var Cart = React.createClass({
  getInitialState: function() {
    return {cart: gon.cart,
            numVisibleCartItems: NUM_VISIBLE_CART_ITEMS};
  },
  viewMoreClicked: function(event) {
    this.props.handleCartEvent({SEE_MORE_CART_ITEMS: 1});
  },
  removeBookFromCart: function(bookId) {
    // TODO figure out how to refactor this
    $.ajax({
      type: "POST",
      url: "/api/v1/carts/remove/" + bookId,
      data: {
        book_id: bookId,
        user_id: this.props.user.id
      }
    }).done(function(message) {
      console.log("Received response " + message.message);
    });
  },
  render: function() {
    var displayCart = _.last(this.props.cart, this.props.numVisibleCartItems).reverse();
    var viewMore;
    if (this.props.cart.length > this.props.numVisibleCartItems) {
      viewMore = (
        <a onClick={this.viewMoreClicked}>View More</a>
      );
    }
    var cartItems = displayCart.map(function(cartItem) {
      return (
        <div>
          <CartItem book={cartItem}
                    handleCartEvent={this.props.handleCartEvent} />
        </div>
      );
    }.bind(this));
    return (
      <div>
        {cartItems}
        {viewMore}
      </div>
    );
  }
});

var CartHeader = React.createClass({
  render: function() {
    return (
      <div>
        Cart ({this.props.cart.length})
      </div>
    );
  }
});

React.renderComponent(
  <Cart cart={gon.cart}
        numVisibleCartItems={NUM_VISIBLE_CART_ITEMS} />,
  document.getElementById("cart")
);

