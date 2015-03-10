class RegistrationsController < Devise::RegistrationsController
  before_filter :configure_permitted_parameters, :only => [:create]
  skip_before_filter :require_no_authentication

  def create
    build_resource(sign_up_params)

    project_ids = Array(user_params[:projects])
    project_ids.each do |project_id|
      resource.projects << Project.find(project_id)
    end

    if resource.save
      render json: { message: "User created!", user: resource }
    else
      clean_up_passwords resource
      errors = resource.errors.full_messages
      render json: { message: "User could not be created!", errors: errors }, status: :forbidden
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) { |u|
      u.permit(:email,
               :first_name,
               :last_name,
               :password,
               :password_confirmation)
    }
  end

  private

  def user_params
    params.require(:user).permit(projects: [])
  end
end
