class UserMailer < Devise::Mailer
  def welcome(record, opts={})
    devise_mail(record, :welcome, opts)
  end
end