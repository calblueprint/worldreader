# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

task :scrape_amazon, [:asin] => :environment do |t, args|
  require 'nokogiri'
  require 'open-uri'

  puts "Scraping Amazon for book: " + args[:asin]

  url = "http://www.amazon.com/dp/" + args[:asin]
  doc = Nokogiri::HTML(open(url))
  image = doc.css('div#thumbs-image img')[0]['src']
  image.slice!('._SS30_')
  description = doc.css('div#ps-content div#postBodyPS').text

  book = Book.where(asin: args[:asin]).first
  book.image = image
  book.description = description
  book.save
end

task update_books: :environment do
  puts "Scraping Amazon for all book data"

  Book.all.each do |book|
    done = false
    i = 0
    begin
      i += 1
      begin
        Rake::Task["scrape_amazon"].invoke(book.asin)
        Rake::Task["scrape_amazon"].reenable
        done = true
      rescue Exception => e
        Rake::Task["scrape_amazon"].reenable
        $done = false
      end
    end while done == false && i < 3
  end
end