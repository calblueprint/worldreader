
var Cart = Backbone.Model.extend({
  defaults : {
    items : []
  }
});

var cart = new Cart({
  items : gon.cart
});
