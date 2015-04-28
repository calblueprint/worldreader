require 'rails_helper'
require 'spec_helper'

feature "Admin Dashboard" do
  before(:each) do
    admin_sign_in
  end
end
