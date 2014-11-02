class Admin::DashboardController < ApplicationController

  def index
  end

  def search
  end
  
  # ordered so that partners with new purchases are first
  def display_partners 
    partners = User.partners
    render json: partners
  end

end
