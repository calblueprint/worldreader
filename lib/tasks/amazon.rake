namespace :amazon do
  desc "Scrapes amazon for book data."
  task :scrape, [:asin] => :environment do |_t, args|
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

  desc "Updates book information and images."
  task update_books: :environment do
    puts "Scraping Amazon for all book data"

    Book.all.each do |book|
      done = false
      i = 0
      loop do
        i += 1
        begin
          Rake::Task["amazon:scrape"].invoke(book.asin)
          Rake::Task["amazon:scrape"].reenable
          done = true
        rescue OpenURI::HTTPError => e
          if e.message == '404 Not Found'
            # No longer available on Amazon
            FailedUpdate.create_or_update(book)
          else
            # Amazon failed us
            Rake::Task["amazon:scrape"].reenable
            done = false
          end
        end
        break if done == true || i >= 5
      end
    end
  end
end
