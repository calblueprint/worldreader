class RegistrationsController < Devise::RegistrationsController
  before_filter :configure_permitted_parameters, :only => [:create]
  skip_before_filter :require_no_authentication 

  def create
    build_resource(sign_up_params)
    if resource.save
      redirect_to admin_registrations_path
    else
      clean_up_passwords resource
      respond_with resource
    end
  end
  
  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) {
      |u| u.permit(:email, :password)
    }
  end
end