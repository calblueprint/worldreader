class RegistrationsController < Devise::RegistrationsController
  before_filter :configure_permitted_parameters, :only => [:create]
  skip_before_filter :require_no_authentication

  def create
    build_resource(sign_up_params)
    project = Project.new(project_params)
    if project.valid? and resource.valid?
      project.save
      resource.projects << project
      resource.save
      render json: { message: "User created!", user: resource }
    else
      clean_up_passwords resource
      errors = resource.errors.full_messages + project.errors.full_messages
      render json: { message: "User could not be created!", errors: errors }, status: :forbidden
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) { |u|
      u.permit(:email, :password, :password_confirmation, :book_list_ids)
    }
  end

  private

  def project_params
    params.require(:project).permit(:name, :origin_id, language_ids: [])
  end
end
