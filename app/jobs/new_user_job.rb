class NewUserJob
  include SuckerPunch::Job

  def perform(sign_up_params)
    ::UserNotifier.signup_email(sign_up_params).deliver
  end
end
