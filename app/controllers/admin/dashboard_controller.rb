class Admin::DashboardController < ApplicationController

  def index
  end

  def search
  end
  
  def display_partners
    partners = User.partners
    render json: partners
  end

end
