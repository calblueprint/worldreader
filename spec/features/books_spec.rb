require 'rails_helper'

describe "Books" do
  describe "GET /books" do
    it "displays book" do
      Book.create! name: "Day by Day",
                   isbn: "0486440281",
                   description: "The story of a team that had nothing to lose."
      visit books_path
      expect(page).to have_content "Day by Day"
    end
  end
end
