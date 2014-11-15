/** @jsx React.DOM */

var Library = React.createClass({
  getInitialState: function() {
    return {cart: gon.cart,
            numVisibleCartItems: NUM_VISIBLE_CART_ITEMS};
  },
  removeBookFromCart: function(bookId) {
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
  addBookToCart: function(bookId) {
    $.ajax({
      type: "POST",
      url: "/api/v1/carts/add/" + bookId,
      data: {
        book_id: bookId,
        user_id: this.props.user.id
      }
    }).done(function(message) {
      console.log("Received response " + message.message);
    });
  },
  handleCartEvent: function(event) {
    if (event.REMOVE_BOOK_FROM_CART) {
      var bookId = event.REMOVE_BOOK_FROM_CART.id;
      var cart = _.reject(this.state.cart, function(el) {
        return el.id == bookId;
      });
      this.setState({numVisibleCartItems:
                    _.min([NUM_VISIBLE_CART_ITEMS,
                          this.state.cart.length])});
      this.setState({cart: cart});
      this.removeBookFromCart(bookId);
    } else if (event.ADD_BOOK_TO_CART) {
      var cart = this.state.cart;
      var book = event.ADD_BOOK_TO_CART;
      cart.push(book);
      this.setState({cart: cart});
      this.addBookToCart(book.id);
    } else if (event.SEE_MORE_CART_ITEMS) {
      this.setState({numVisibleCartItems:
                    _.min([this.state.numVisibleCartItems + NUM_VISIBLE_CART_ITEMS,
                          this.state.cart.length])});
    }
  },
  // renderCart: function() {
  //   React.renderComponent(
  //     <CartHeader cart={this.state.cart} />,
  //     document.getElementById("cart_header")
  //   );
  //   React.renderComponent(
  //     <Cart cart={this.state.cart}
  //           numVisibleCartItems={NUM_VISIBLE_CART_ITEMS}
  //           handleCartEvent={this.handleCartEvent} />,
  //           document.getElementById("cart")
  //   );
  // },
  render: function() {
    // if (this.props.user) {
    //   this.renderCart();
    // }
    return (
      <div>
        <BookList user={this.props.user}
                  books={this.props.books}
                  cart={this.state.cart}
                  handleCartEvent={this.handleCartEvent} />
      </div>
    );
  }
});

React.renderComponent(
  <Library user={gon.current_user}
           books={gon.books} />,
  document.getElementById("library")
);
