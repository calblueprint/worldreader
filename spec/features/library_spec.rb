require 'rails_helper'

feature "Library" do
  scenario "User clicks on a book" do
    book = create(:book)
    visit "/books"
    first(:link, book.name).click
    expect(page).to have_content book.name
    expect(page).to have_content book.description
  end
end
