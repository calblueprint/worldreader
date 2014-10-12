class Admin::DashboardController < ApplicationController
  def index
    @partners = User.all
  end
end
