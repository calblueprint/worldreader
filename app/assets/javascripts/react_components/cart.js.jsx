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
  render: function() {
    var displayCart = _.last(this.props.cart, 5).reverse();
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
        <h3>Your Cart</h3>
        {cartItems}
      </div>
    );
  }
});
