SEEDS = YAML.load(File.read(File.expand_path('../seeds.yml', __FILE__)))

def make_books
  SEEDS[:books].each do |book|
    Book.create!  book
  end
end

def make_users
  1.upto(5) do |n|
    puts "user#{n}@gmail.com"
    User.create!  first_name: "User#{n}",
                  last_name: "LastName",
                  email: "user#{n}@gmail.com",
                  role: 1,
                  password: "password",
                  country: "United States",
                  school: "UC Berkeley",
                  organization: "Blueprint"
  end
  1.upto(2) do |n|
    puts "admin#{n}@gmail.com"
    User.create!  first_name: "Admin#{n}",
                  last_name: "LastName",
                  email: "admin#{n}@gmail.com",
                  role: 2,
                  password: "password"
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
    1.upto(3) do |n|
      Purchase.create!  user_id: user.id,
                        book_id: n,
                        is_purchased: false
    end
    4.upto(6) do |n|
      Purchase.create!  user_id: user.id,
                        book_id: n,
                        purchased_on: DateTime.new(2014, 3, 2),
                        is_purchased: true
    end
  end
end

def make_location_tags
  1.upto(20) do |n|
    Country.create! name: Faker::Address.country
    3.times.map{ 1 + Random.rand(10) }.each do |i|
      book = Book.find(i)
      book.countries << Country.find(n)
      book.save
    end
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
make_users
make_groups
make_purchases
make_location_tags
make_level_tags
make_language_tags
make_genre_tags
make_author_tags
make_publisher_tags
