/** @jsx React.DOM */

var ADD_BOOK_TO_CART = "add";
var REMOVE_BOOK_FROM_CART = "remove";

var Library = React.createClass({
  getInitialState: function() {
    return {cart: gon.cart};
  },
  handleCartEvent: function(event) {
    if (event.REMOVE_BOOK_FROM_CART) {
      var cart = _.reject(this.state.cart, function(el) {
        return el.id == event.REMOVE_BOOK_FROM_CART.id;
      });
      this.setState({cart: cart});
    } else if (event.ADD_BOOK_TO_CART) {
      var cart = this.state.cart;
      cart.push(event.ADD_BOOK_TO_CART);
      this.setState({cart: cart});
    }
  },
  render: function() {
    var cart;
    if (this.props.user) {
      cart = (
        <div id="floating-cart">
          <Cart cart={this.state.cart} handleCartEvent={this.handleCartEvent} />
        </div>
      )
    }
    return (
      <div>
        <BookList user={this.props.user}
                  books={this.props.books}
                  cart={this.state.cart}
                  handleCartEvent={this.handleCartEvent} />
        {cart}
      </div>
    );
  }
});

React.renderComponent(
  <Library user={gon.current_user} books={gon.books} />,
  document.getElementById("library")
);
