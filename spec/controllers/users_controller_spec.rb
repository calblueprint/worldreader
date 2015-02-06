require "rails_helper"
require "users_controller"

describe UsersController do
  describe "#index" do

    before(:each) do
      request.env["HTTP_REFERER"] = "http://www.example.com/"
    end

    it "denies access to non-admins" do
      user = create(:user)
      sign_in user
      get :index
      expect(response.status).to eq(302)
      expect(flash[:alert]).to eq("Access denied.")
    end
  end
end
