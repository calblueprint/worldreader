/** @jsx React.DOM */

var CartItem = React.createClass({
  render: function() {
    return (
      <div className="cart-item">
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
        <li>
          <CartItem book={cartItem} />
        </li>
      );
    }.bind(this));
    return (
      <ul>
        <h3>Your Cart</h3>
        {cartItems}
      </ul>
    );
  }
});
