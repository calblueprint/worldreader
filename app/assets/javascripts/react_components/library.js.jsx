/** @jsx React.DOM */

var ADD_BOOK_TO_CART = "add";
var REMOVE_BOOK_TO_CART = "remove";

var Library = React.createClass({
  getInitialState: function() {
    return {cart: gon.cart};
  },
  handleCartEvent: function(event) {
    if (ADD_CART_EVENT in event) {
      var cart = this.state.cart.push(event[ADD_CART_EVENT]);
      this.state.setState({cart: cart});
    } else if (REMOVE_FROM_CART in event) {
      var cart = _.reject(this.state.cart, function(el) {
        return el.id == event[REMOVE_FROM_CART].id
      })
      this.state.setState({cart: cart});
    }
  },
  render: function() {
    return (
      <div>
      <BookList books={this.props.books} cart={this.state.cart} handleCartEvent={this.handleCartEvent} />
      <Cart cart={this.state.cart} handleCartEvent={this.handleCartEvent} />
      </div>
    );
  }
});

React.renderComponent(
  <Library books={gon.books} />,
  document.getElementById("library")
);
