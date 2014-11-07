/** @jsx React.DOM */

var CartItem = React.createClass({
  render: function() {
    return (
      <div>
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
        <CartItem book={cartItem} />
      );
    }.bind(this));
    return (
      <div>
        {cartItems}
      </div>
    );
  }
});
