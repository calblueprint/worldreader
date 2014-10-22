require 'rails_helper'
require 'spec_helper'

feature "Admin Dashboard" do

  before(:each) do
    admin_sign_in
  end

  scenario "Admin sees dashboard link when logged in" do
    visit root_path
    user = create(:user)
    click_link 'Manage Partners'
    expect(page).to have_content user.email
  end

  scenario "Admin can see user profile" do
    visit root_path
    user = create(:user)
    click_link 'Manage Partners'
    expect(page).to have_content user.email
    click_link user.email
    expect(page).to have_content user.name
    expect(page).to have_content user.email
  end
end
