require "rails_helper"
require "users_controller"

describe UsersController do
  describe "#index" do

    before(:each) do
      request.env["HTTP_REFERER"] = "http://www.example.com/"
    end

    it "shows all users" do
      user1 = create(:user, role: 2)
      user2 = create(:user)
      user3 = create(:user)
      sign_in user1
      get :index
      expect(response.status).to eq(200)
      expect(assigns(:users)).to eq([user1, user2, user3])
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
