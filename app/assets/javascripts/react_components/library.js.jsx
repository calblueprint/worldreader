/** @jsx React.DOM */

// Cart Variables
var ADD_BOOK_TO_CART = "add";
var REMOVE_BOOK_FROM_CART = "remove";
var SEE_MORE_CART_ITEMS = "see more";
var NUM_VISIBLE_CART_ITEMS = 5;

var Library = React.createClass({
  getInitialState: function() {
    return {cart: gon.cart,
            numVisibleCartItems: NUM_VISIBLE_CART_ITEMS};
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
      this.removeBook(bookId);
    } else if (event.ADD_BOOK_TO_CART) {
      var cart = this.state.cart;
      var book = event.ADD_BOOK_TO_CART;
      cart.push(book);
      this.setState({cart: cart});
      this.addBook(book.id);
    } else if (event.SEE_MORE_CART_ITEMS) {
      this.setState({numVisibleCartItems:
                    _.min([this.state.numVisibleCartItems + NUM_VISIBLE_CART_ITEMS,
                          this.state.cart.length])});
    }
  },
  removeBook: function(bookId) {
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
  addBook: function(bookId) {
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
  render: function() {
    var cart;
    if (this.props.user) {
      cart = (
        <div id="floating-cart" className="col-md-2">
          <Cart cart={this.state.cart}
                handleCartEvent={this.handleCartEvent}
                numVisibleCartItems={this.state.numVisibleCartItems} />
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
