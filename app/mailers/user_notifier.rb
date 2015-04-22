class UserNotifier < ActionMailer::Base
  default from: "notifications@worldreader.org"

  def signup_email(user, password)
    @user = user
    @password = password
    mail(to: @user.email, subject: "Welcome to Worldreader!")
  end
end
