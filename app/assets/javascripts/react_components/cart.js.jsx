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
    var cartItems = this.props.cart.map(function(cartItem) {
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
