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
            failure = FailedUpdate.where(book_id: book.id).first
            if failure
              failure.touch
            else
              failure = FailedUpdate.create! book_id: book.id
            end
          else
            # Amazon failed us
            Rake::Task["scrape_amazon"].reenable
            $done = false
          end
      end
    end while done == false && i < 5
  end
end

LEVELS_CONVERT = YAML.load(File.read(File.expand_path('../db/levelsConvert.yml', __FILE__)))

task add_level_tags: :environment do
  puts "Adding human-readable level tags"

  Book.all.each do |book|
    if book.levels.length == 1 && ['A', 'B', 'C', 'D', 'E'].include?(book.levels[0].name)
        levels_to_add = Set.new
        book.levels.each do |level|
          corresp_levels = LEVELS_CONVERT["levelsConvert"][book.levels[0].name][book.genre.name]
          corresp_levels.each do |level_to_add|
            levels_to_add.add(Level.find_by_name(level_to_add))
          end
        end
      book.levels.concat levels_to_add.to_a
    end
  end
end