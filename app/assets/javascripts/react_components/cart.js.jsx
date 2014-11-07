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
        <CartItem book={cartItem} className="cart-item-ting" />
      );
    }.bind(this));
    return (
      <div>
        {cartItems}
      </div>
    );
  }
});
