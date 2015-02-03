class RegistrationsController < Devise::RegistrationsController
  before_filter :configure_permitted_parameters, :only => [:create]
  skip_before_filter :require_no_authentication

  def create
    build_resource(user_params)
    if resource.save
      render json: {message: "User created!"}
    else
      clean_up_passwords resource
      render json: {message: "User could not be created!"}, status: :forbidden
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) {
      |u| u.permit(:email, :password)
    }
  end

  private
  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
  end
end
