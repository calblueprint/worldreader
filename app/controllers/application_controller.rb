class ApplicationController < ActionController::Base
  before_action :set_user_cart
  protect_from_forgery with: :exception
  def after_sign_in_path_for(user)
    books_path
  end

  def set_user_cart
    if user_signed_in?
      gon.current_user = current_user
      gon.cart = current_user.cart
    else
      gon.cart = []
    end
  end
end
