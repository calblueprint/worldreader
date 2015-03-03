SEEDS = YAML.load(File.read(File.expand_path('../seeds.yml', __FILE__)))

def make_books
  SEEDS[:books].each do |book|
    Book.create!  book.merge! (in_store: true)
  end
end

def make_users
  c = Country.find(1)
  l = Level.find(1)
  la = Language.find(1)
  1.upto(5) do |n|
    User.create!  email: "user#{n}@gmail.com",
                  role: 0,
                  password: "password",
                  organization: "org#{n}",
                  countries: [c],
                  levels: [l],
                  languages: [la]
  end
  1.upto(2) do |n|
    User.create!  email: "admin#{n}@gmail.com",
                  role: 1,
                  password: "password",
                  organization: "worldreader",
                  countries: [c],
                  levels: [l],
                  languages: [la]
  end
  1.upto(2) do |n|
    User.create!  email: "vip#{n}@gmail.com",
                  role: 2,
                  password: "password",
                  organization: "worldreader",
                  countries: [c],
                  levels: [l],
                  languages: [la]
  end
end

def make_groups
  User.all.each do |user|
    1.upto(3) do |n|
      user.groups.create! name: "Group#{n}",
                          country: "United States",
                          description: "Awesome group",
                          books: Book.all
    end
  end
end

def make_purchases
  User.all.each do |user|
    4.upto(6) do |n|
      Purchase.create!  user_id: user.id,
                        book_id: n,
                        purchased_on: DateTime.new(2014, 3, 2),
                        is_purchased: true,
                        is_approved: true
    end
  end

  1.upto(3) do |n|
    Purchase.create!  user_id: 1,
                      book_id: n,
                      purchased_on: DateTime.new(2014, 3, 2),
                      is_purchased: true
  end

  1.upto(3) do |n|
    Purchase.create!  user_id: 2,
                      book_id: n,
                      purchased_on: DateTime.new(2014, 3, 2),
                      is_purchased: true
  end

  1.upto(3) do |n|
    Purchase.create!  user_id: 3,
                      book_id: n,
                      purchased_on: DateTime.new(2014, 3, 2),
                      is_purchased: true
  end
end

def make_country_tags
  1.upto(10) do |n|
    c = Country.create! name: Faker::Address.country
    book = Book.find(n)
    book.country = c
    book.save
  end
end

def make_level_tags
  Level.create! name: 'Elementary'
  Level.create! name: 'Secondary'
  Level.create! name: 'High'
  1.upto(5) do |n|
    book = Book.find(n)
    book.levels << Level.find(1)
    book.save
  end
  3.upto(7) do |n|
    book = Book.find(n)
    book.levels << Level.find(2)
    book.save
  end
  6.upto(10) do |n|
    book = Book.find(n)
    book.levels << Level.find(3)
    book.save
  end
end

def make_language_tags
  Language.create! name: 'Somali'
  Language.create! name: 'Hausa'
  1.upto(5) do |n|
    book = Book.find(n)
    book.language = Language.find(1)
    book.save
  end
  6.upto(10) do |n|
    book = Book.find(n)
    book.language = Language.find(2)
    book.save
  end
end

def make_genre_tags
  Genre.create! name: 'Fiction'
  Genre.create! name: 'Non-fiction'
  1.upto(5) do |n|
    book = Book.find(n)
    book.genre = Genre.find(1)
    book.save
  end
  6.upto(10) do |n|
    book = Book.find(n)
    book.genre = Genre.find(2)
    book.save
  end
end

def make_author_tags
  Author.create! name: 'Varun Rau'
  Author.create! name: 'Eileen Li'
  Author.create! name: 'Will Tang'
  Author.create! name: 'Ethan Chiou'
  1.upto(4) do |n|
    book = Book.find(n)
    book.authors << Author.find(1)
    book.save
  end
  3.upto(6) do |n|
    book = Book.find(n)
    book.authors << Author.find(2)
    book.save
  end
  5.upto(8) do |n|
    book = Book.find(n)
    book.authors << Author.find(3)
    book.save
  end
  7.upto(10) do |n|
    book = Book.find(n)
    book.authors << Author.find(4)
    book.save
  end
end

def make_publisher_tags
  Publisher.create! name: '@vdawg'
  Publisher.create! name: '@will'
  1.upto(5) do |n|
    book = Book.find(n)
    book.publisher = Publisher.find(1)
    book.save
  end
  6.upto(10) do |n|
    book = Book.find(n)
    book.publisher = Publisher.find(2)
    book.save
  end
end

make_books
make_groups
make_purchases
make_country_tags
make_level_tags
make_language_tags
make_users
make_genre_tags
make_author_tags
make_publisher_tags
