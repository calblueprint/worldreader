class ApplicationController < ActionController::Base
  before_action :set_user_cart, :set_auth_token, :new_partner_info
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

  def new_partner_info
    gon.countries = Country.uniq.all.map{ |x|
      {
        id: x.id, name: x.name
      }
    }
    gon.levels = Level.uniq.all.map{ |x|
      {
        id: x.id, name: x.name
      }
    }
    gon.languages = Language.uniq.all.map{ |x|
      {
        id: x.id, name: x.name
      }
    }
  end


  def set_auth_token
    gon.auth_token = form_authenticity_token
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
end
