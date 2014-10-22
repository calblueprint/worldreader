# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

task :scrape_amazon, [:isbn] => :environment do |t, args|
  require 'nokogiri'
  require 'open-uri'
  require 'isbn'

  puts "Scraping Amazon for book: " + args[:isbn]

  isbn = ISBN.ten(args[:isbn])
  url = "http://www.amazon.com/dp/" + isbn
  doc = Nokogiri::HTML(open(url))
  image = doc.css('img#imgBlkFront')[0]["src"]
  description = doc.css('#bookDescription_feature_div noscript').text

  book = Book.where(isbn: isbn).first
  book.image = image
  book.description = description
  book.save
end

task update_books: :environment do
  require 'nokogiri'
  require 'open-uri'
  require 'isbn'

  puts "Scraping Amazon for all book data"

  url = "http://www.amazon.com/dp/"

  Book.all.each do |book|
    doc = Nokogiri::HTML(open(url + ISBN.ten(book.isbn)))
    image = doc.css('img#imgBlkFront')[0]["src"]
    description = doc.css('#bookDescription_feature_div noscript').text

    book.image = image
    book.description = description
    book.save
  end
end
