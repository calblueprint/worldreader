require 'rails_helper'
require 'spec_helper'

feature "Admin Dashboard" do

  scenario "Admin sees dashboard link when logged in" do
    admin_sign_in
    visit root_path
    user = create(:user)
    click_link('Manage Partners')
    expect(page).to have_content user.email
  end
end
