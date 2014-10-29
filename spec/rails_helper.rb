ENV["RAILS_ENV"] ||= "test"
require "spec_helper"
require File.expand_path("../../config/environment", __FILE__)
require "rspec/rails"
require "capybara/rspec"
require "devise"
require "factory_girl_rails"

Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }

ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.include Devise::TestHelpers, type: :controller
  config.include Features::SessionHelpers, type: :feature
  config.include FactoryGirl::Syntax::Methods
  config.include Capybara::DSL
  config.include(MailerMacros)
  config.before(:each) { reset_email }
end
