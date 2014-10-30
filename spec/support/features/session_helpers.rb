module Features
  module SessionHelpers
    def sign_up_with(email, password)
      visit new_user_registration_path
      fill_in 'Email', with: email
      fill_in 'Password', with: password
      click_button 'Sign up'
    end

    def sign_in
      user = create(:user)
      visit root_path
      click_link 'Log in'
      fill_in 'Enter email', with: user.email
      fill_in 'Password', with: user.password
      click_button 'Sign in'
    end

    def admin_sign_in
      user = create(:user, role: 2)
      visit root_path
      click_link 'Log in'
      fill_in 'Enter email', with: user.email
      fill_in 'Password', with: user.password
      click_button 'Sign in'
    end
  end
end
