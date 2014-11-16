/** @jsx React.DOM */

var Library = React.createClass({
  getInitialState: function() {
    return {cart: cart,
            numVisibleCartItems: NUM_VISIBLE_CART_ITEMS,
            user: gon.current_user};
  },
  componentWillMount: function() {
    cart.on("change", (function() {
      this.forceUpdate();
    }.bind(this)));
  },
  componentWillUnmount: function() {
    cart.off("change");
  },
  removeBookFromCart: function(bookId) {
    $.ajax({
      type: "POST",
      url: "/api/v1/carts/remove/" + bookId,
      data: {
        book_id: bookId,
        user_id: this.state.user.id
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
        user_id: this.state.user.id
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
  render: function() {
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
