require "rails_helper"

describe "UserRegister" do
  it "emails user after sign up" do
    test_email = "test_email@test.com"
    visit new_user_registration_path
    fill_in "Email", with: test_email
    fill_in "First name", with: "John"
    fill_in "Last name", with: "Du"
    fill_in "Password", with: "password"
    fill_in "Password confirmation", with: "password"
    click_button "Sign up"
    expect(last_email.to).to eq([test_email])
  end
end