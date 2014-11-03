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

  def partner_information
    user = User.find(params[:id])
    render json: user
  end

  def display_groups
    groups = Group.where("user_id = " + params[:id])
    render json: groups
  end

end
