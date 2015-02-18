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
  }).done(function() {
    location.reload();
  }).error(function(){
    toastr.error('Invalid username or password.');
  });
}