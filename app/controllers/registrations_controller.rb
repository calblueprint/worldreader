class RegistrationsController < Devise::RegistrationsController
  before_filter :configure_permitted_parameters, :only => [:create]
  skip_before_filter :require_no_authentication

  def create
    build_resource(sign_up_params)

    level_ids = Array(user_params[:levels])
    level_ids.each do |level_id|
      resource.levels << Level.find(level_id)
    end

    language_ids = Array(user_params[:languages])
    language_ids.each do |language_id|
      resource.languages << Language.find(language_id)
    end

    country_ids = Array(user_params[:countries])
    country_ids.each do |country_id|
      resource.countries << Country.find(country_id)
    end

    if resource.save
      render json: { message: "User created!" }
    else
      clean_up_passwords resource
      render json: { message: "User could not be created!", errors: resource.errors.full_messages }, status: :forbidden
    end
  end

  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) {
      |u| u.permit(:email, :first_name, :last_name, :organization, :password,
           :password_confirmation)
    }
  end

  private 
  def user_params
    params.require(:user).permit(:countries => [], :levels => [], :languages => [])
  end
end
