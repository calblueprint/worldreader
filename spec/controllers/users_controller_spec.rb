require 'rails_helper'
require 'users_controller'

describe UsersController do
  describe "#index" do
    it "shows all users" do
      user = create(:user)
      get :index
      expect(response.status).to eq(302)
      expect(assigns(:users)).to eq([user])
    end
  end
end