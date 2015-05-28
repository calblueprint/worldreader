class ApplicationController < ActionController::Base
  before_action :set_current_user, :set_auth_token, :new_partner_info, :search_tags
  after_action :store_location
  protect_from_forgery with: :exception

  def after_sign_in_path_for(_user)
    session[:previous_url] || root_path
  end

  def set_auth_token
    gon.auth_token = form_authenticity_token
  end

  def set_current_user
    gon.current_user = current_user
  end

  def store_location
    # store last url - this is needed for post-login redirect to whatever the user last visited.
    return unless request.get?
    if request.path != "/users/sign_in" &&
       request.path != "/users/sign_up" &&
       request.path != "/users/password/new" &&
       request.path != "/users/password/edit" &&
       request.path != "/users/confirmation" &&
       request.path != "/users/sign_out" &&
       !request.xhr? # don't store ajax calls
      session[:previous_url] = request.fullpath
    end
  end

  rescue_from CanCan::AccessDenied do |exception|
    flash[:error] = exception.message
    redirect_to root_url
  end

  private

  def search_tags
    index = 0
    @country_tags = Country.tags(index)
    index += @country_tags.count
    @level_tags = Level.tags(index)
    index += @level_tags.count
    @language_tags = Language.tags(index)
    index += @language_tags.count
    @genre_tags = Genre.tags(index)
    index += @genre_tags.count
    @subcategory_tags = Subcategory.tags(index)
    gon.all_tags = @country_tags + @level_tags + @language_tags + @genre_tags +
      @subcategory_tags
    @all_tags = gon.all_tags
    gon.project_tags = @country_tags + @level_tags + @language_tags
  end
end
