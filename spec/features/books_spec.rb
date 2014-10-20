require 'rails_helper'

feature "Library" do
  scenario "User clicks on a book" do
    book = contact = create(:book)
    visit "/books"
    save_and_open_page
    first(:link, book.name).click
    expect(page).to have_content book.name
    expect(page).to have_content book.description
  end
end
