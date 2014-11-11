var cartView = "#floating-cart";
var menuY = 0;

$(document).ready(function() {
  // setUpCartView();
});

function setUpCartView() {
  menuY = parseInt($(cartView).css("top").
                   substring(0,$(cartView).css("top").indexOf("px")), 10);
  $(window).scroll(function() {
    var offset = menuY + $(document).scrollTop() + "px";
    $(cartView).animate({top:offset}, {duration: 0, queue: false});
  });
}

