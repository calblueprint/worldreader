class RegistrationsController < Devise::RegistrationsController
  before_filter :configure_permitted_parameters, :only => [:create]
  skip_before_filter :require_no_authentication

  def create
    build_resource(sign_up_params)

    project = Project.create(name: project_params[:name])
    project.country = Country.find(project_params[:country])
    language_ids = Array(project_params[:languages])
    language_ids.each do |language_id|
      project.languages << Language.find(language_id)
    end
    resource.projects << project

    booklist_ids = Array(user_params[:booklists])
    booklist_ids.each do |booklist_id|
      resource.book_lists << BookList.find(booklist_id)
    end

    if project.valid? and resource.valid?
      project.save
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
      u.permit(:email, :password, :password_confirmation, :booklists)
    }
  end

  private

  def user_params
    params.require(:user).permit(booklists: [])
  end


  def project_params
    params.require(:project).permit(:name, :country, languages: [])
  end
end
