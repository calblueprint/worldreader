function ready() {
  $('#login-button').click(login);
}

$(document).on('page:load', function() {
  ready();
});

function login() {
  $.ajax({
    type: 'POST',
    url: '/users/sign_in',
    data: {
      user:{
        email: $('.inputEmail').val(),
        password: $('.inputPassword').val()
      }
    }
  }).done(function(results) {
    location.reload()
  }).error(function(results){
    toastr.error("Invalid username or password.");
  });
}