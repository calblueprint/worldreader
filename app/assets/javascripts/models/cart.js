
var Cart = Backbone.Model.extend({
  defaults : {
    items : []
  },
});

var cart = new Cart({
  items : gon.cart
});

var removeBook = function(book, userId) {
  var cartItems = cart.get("items");
  var books = _.reject(cartItems, function(el) {
    return el.id == book.id;
  });
  cart.set("items", books);

  $.ajax({
    type: "POST",
    url: "/api/v1/carts/remove/" + book.id,
    data: {
      book_id: book.id,
      user_id: userId
    }
  }).done(function(message) {
    console.log("Received response for book removal: " + message.message);
  });

  toastr.success("Book removed from cart!");
}

var addBook = function(book, userId) {
  var cartItems = cart.get("items");
  var books = cartItems.concat([book]);
  cart.set("items", books);

  $.ajax({
    type: "POST",
    url: "/api/v1/carts/add/" + book.id,
    data: {
      book_id: book.id,
      user_id: userId
    }
  }).done(function(message) {
    console.log("Received response for book addition: " + message.message);
  });

  toastr.success("Book added to cart!");
}

