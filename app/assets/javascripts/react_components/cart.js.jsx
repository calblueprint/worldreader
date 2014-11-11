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
  viewMoreClicked: function(event) {
    this.props.handleCartEvent({SEE_MORE_CART_ITEMS: 1});
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
        <h3>Your Cart</h3>
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

