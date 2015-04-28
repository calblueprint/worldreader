namespace :book_levels do

  LEVELS_CONVERT = YAML.load(File.read(File.expand_path('../../../db/levelsConvert.yml', __FILE__)))

  desc "Adds human-readable level tags to books."
  task add_level_tags: :environment do
    puts "Adding human-readable level tags"

    Book.where(level_tags_added: false).each do |book|
      book.add_level_tags(LEVELS_CONVERT)
    end
  end
end
