require "rails_helper"
require "admin/dashboard_controller"

include Features
include SessionHelpers

describe Admin::DashboardController do
  before(:each) do |data|
    unless data.metadata[:skip_before]
      admin_sign_in
    end
  end

  describe "#index", :skip_before do
    it "is redirected for non-admins" do
      get :index
      expect(response).to have_http_status(302) # redirected
    end

    it "is available for admins" do
      admin_sign_in
      get :index
      expect(response).to have_http_status(:ok)
    end
  end
end
