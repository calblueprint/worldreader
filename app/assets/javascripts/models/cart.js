
var Cart = Backbone.Model.extend({
  defaults : {
    items : []
  },
});

var cart = new Cart({
  items : gon.cart
});

var isPurchaseable = function() {
  var donatedBooks = _.filter(cart.get("items"), function(book) {
    return parseFloat(book.price) <= 0;
  });
  var paidBooks = _.filter(cart.get("items"), function(book) {
    return parseFloat(book.price) > 0;
  });
  return paidBooks.length >= donatedBooks.length;
};

var makePurchase = function() {
  var bookIds = _.map(cart.get("items"), function(book) {
    return book.id;
  });
  $.ajax({
    type: "POST",
    url: "/carts/" + gon.current_user.id + "/create_purchase",
    data: {
      book_ids: bookIds
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
    },
    success: function(response) {
      toastr.success(book.title + " was removed from your cart!");
    }.bind(this),
    error: function (xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  }).done(function(message) {
    console.log("Received response for book removal: " + message.message);
  });
};

var addBook = function(book, userId, groups) {
  var cartItems = cart.get("items");
  var books = cartItems.concat([book]);
  cart.set("items", books);

  $.ajax({
    type: "POST",
    url: "/api/v1/carts/add/" + book.id,
    data: {
      book_id: book.id,
      user_id: userId,
      groups: groups
    },
    success: function(response) {
      toastr.success(book.title + " was added to your cart!");
    }.bind(this),
    error: function (xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  }).done(function(message) {
    console.log("Received response for book addition: " + message.message);
  });
}

