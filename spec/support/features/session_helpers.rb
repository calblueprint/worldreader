module Features
  module SessionHelpers
    def sign_up_with(email, password)
      visit new_user_registration_path
      fill_in 'Email', with: email
      fill_in 'Password', with: password
      click_button 'Sign up'
    end

    def user_sign_in
      user = create(:user)
      sign_in(user)
    end

    def admin_sign_in
      user = create(:user, role: 2)
      sign_in(user)
    end

    def sign_in(user)
      visit root_path
      click_link 'Log in'
      first('#login').fill_in 'Enter email', with: user.email
      first('#login').fill_in 'Password', with: user.password
      click_button 'Sign in'
    end
  end
end
