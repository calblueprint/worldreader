require "rails_helper"
require "book_lists_controller"

describe BookListsController do
  describe "#index" do
    it "is available" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end
end
