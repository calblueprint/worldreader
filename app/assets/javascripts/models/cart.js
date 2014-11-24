
var Cart = Backbone.Model.extend({
  defaults : {
    items : []
  },
});

var cart = new Cart({
  items : gon.cart,
});

var isPurchaseable = function() {
  donatedBooks = _.filter(cart.get("items"), function(book) {
    return parseFloat(book.price) <= 0;
  });
  paidBooks = _.filter(cart.get("items"), function(book) {
    return parseFloat(book.price) > 0;
  });
  return paidBooks.length >= donatedBooks.length;
}

var makePurchase = function() {
  var book_ids = _.map(cart.get("items"), function(book) {
    return book.id;
  })
  $.ajax({
    type: "POST",
    url: "/carts/" + gon.current_user.id + "/create_purchase",
    data: {
      book_ids: book_ids
    }
  }).done(function() {
  });
};


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

  toastr.success(book.name + " removed from your cart!");
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

  toastr.success(book.name + " added to your cart!");
}

