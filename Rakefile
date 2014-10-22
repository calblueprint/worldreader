# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

task :scrape_amazon, [:isbn] => :environment do |t, args|
  require 'nokogiri'
  require 'open-uri'
  require 'isbn'

  puts "Scraping Amazon for book: " + args[:isbn]

  isbn10 = ISBN.ten(args[:isbn])
  url = "http://www.amazon.com/dp/" + isbn10
  doc = Nokogiri::HTML(open(url))
  image = doc.css('img#imgBlkFront')[0]["src"]
  description = doc.css('#bookDescription_feature_div noscript').text

  book = Book.where(isbn: args[:isbn]).first
  book.image = image
  book.description = description
  book.save
end

task update_books: :environment do
  puts "Scraping Amazon for all book data"

  Book.all.each do |book|
    Rake::Task["scrape_amazon"].invoke(book.isbn)
    Rake::Task["scrape_amazon"].reenable
  end
end