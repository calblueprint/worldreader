require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

task :scrape_amazon, [:asin] => :environment do |_t, args|
  require 'nokogiri'
  require 'open-uri'

  puts "Scraping Amazon for book: " + args[:asin]

  url = "http://www.amazon.com/dp/" + args[:asin]
  doc = Nokogiri::HTML(open(url))
  image = doc.css('div#thumbs-image img')[0]['src']
  image.slice!('._SS30_')

  book = Book.where(asin: args[:asin]).first
  book.image = image
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
      rescue OpenURI::HTTPError => e
        if e.message == '404 Not Found'
          # No longer available on Amazon
          FailedUpdate.create_or_update(book)
        else
          # Amazon failed us
          Rake::Task["scrape_amazon"].reenable
          done = false
        end
      end
    end while done == false && i < 5
  end
end
