require 'rails_helper'
require 'spec_helper'

feature "Admin Dashboard" do

  scenario "Admin sees dashboard link when logged in" do
    admin_sign_in
    visit root_path
    save_and_open_page
  end
end
