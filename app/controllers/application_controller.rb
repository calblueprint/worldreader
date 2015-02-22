class ApplicationController < ActionController::Base
  before_action :set_user_cart, :search_tags
  after_action :store_location
  protect_from_forgery with: :exception

  def after_sign_in_path_for(user)
    session[:previous_url] || root_path
  end

  def set_user_cart
    if user_signed_in?
      gon.current_user = current_user
      gon.cart = current_user.cart
    else
      gon.cart = []
    end
  end

  def store_location
    # store last url - this is needed for post-login redirect to whatever the user last visited.
    return unless request.get? 
    if (request.path != "/users/sign_in" &&
        request.path != "/users/sign_up" &&
        request.path != "/users/password/new" &&
        request.path != "/users/password/edit" &&
        request.path != "/users/confirmation" &&
        request.path != "/users/sign_out" &&
        !request.xhr?) # don't store ajax calls
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
    country_tags = Country.uniq.select([:id, :name]).map{ |x|
      index += 1
      {
        value: index, text: x.name, tagType: "countries", id: x.id
      }
    }
    level_tags = Level.uniq.select([:id, :name]).map{ |x|
      index += 1
      {
        value: index, text: x.name, tagType: "levels", id: x.id
      }
    }
    language_tags = Language.uniq.select([:id, :name]).map{ |x|
      index += 1
      {
        value: index, text: x.name, tagType: "language", id: x.id
      }
    }
    genre_tags = Genre.uniq.select([:id, :name]).map{ |x|
      index += 1
      {
        value: index, text: x.name, tagType: "genre", id: x.id
      }
    }
    gon.all_tags = country_tags + level_tags + language_tags + genre_tags
    gon.user_tags = country_tags + level_tags + language_tags

  end

end
