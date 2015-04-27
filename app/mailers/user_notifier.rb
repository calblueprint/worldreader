class UserNotifier < ActionMailer::Base
  default from: "notifications@worldreader.org"

  def signup_email(sign_up_params)
    @email = sign_up_params.email
    @password = sign_up_params.password
    mail(to: @user.email, subject: "Welcome to Worldreader!")
  end
end
