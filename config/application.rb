require File.expand_path('../boot', __FILE__)

require 'rails/all'
require 'csv'
require 'will_paginate/array'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Worldreader
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    config.react.addons = true
    # Don't generate extra files when generating models and controllers
    config.generators do |generate|
      generate.helper               false
      generate.javascript_engine    false
      generate.request_specs        false
      generate.routing_specs        false
      generate.stylesheets          false
      generate.view_specs           false
      generate.controller_specs     false
      generate.test_framework       false
      generate.fixture_replacement  false
    end
  end
end
