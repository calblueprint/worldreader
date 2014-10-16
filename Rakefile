# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

task :scrape_amazon, [:isbn] do |t, args|
  require 'nokogiri'
  require 'open-uri'
  puts "Scraping Amazon for book data"

  url = "http://www.amazon.com/dp/"
  url = url + args[:isbn]
  doc = Nokogiri::HTML(open(url))

  #title = doc.css('span#productTitle')[0].content
  image = doc.css('img#imgBlkFront')[0]["src"]
  description = doc.css('#bookDescription_feature_div noscript').text

  puts image
  puts description
end