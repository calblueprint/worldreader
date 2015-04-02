SEEDS = YAML.load(File.read(File.expand_path('../seeds.yml', __FILE__)))

def make_books
  SEEDS[:books].each do |book|
    Book.create! book.merge! ({ in_store: true,
                                description: Faker::Lorem.paragraph })
  end
end

def make_users
  1.upto(5) do |n|
    user = User.create email: "user#{n}@gmail.com",
                       role: 0,
                       password: "password"
    user.projects << Project.find(1 + Random.rand(Project.count))
    user.save
  end
  1.upto(2) do |n|
    user = User.create email: "admin#{n}@gmail.com",
                       role: 1,
                       password: "password"
    user.projects << Project.find(1 + Random.rand(Project.count))
    user.save
  end
  1.upto(2) do |n|
    user = User.create email: "vip#{n}@gmail.com",
                       role: 2,
                       password: "password"
    user.projects << Project.find(1 + Random.rand(Project.count))
    user.save
  end
end

def make_countries
  1.upto(10) do
    Country.create! name: Faker::Address.country
  end
end

def make_levels
  Level.create! name: "A"
  Level.create! name: "B"
  Level.create! name: "C"
  Level.create! name: "D"
end

def make_languages
  Language.create! name: 'Somali'
  Language.create! name: 'Hausa'
end

def make_genres
  Genre.create! name: 'Fiction'
  Genre.create! name: 'Non-fiction'
end

def make_authors
  Author.create! name: 'Varun Rau'
  Author.create! name: 'Eileen Li'
  Author.create! name: 'Will Tang'
  Author.create! name: 'Ethan Chiou'
end

def make_publishers
  Publisher.create! name: 'Harper Collins'
  Publisher.create! name: 'Penguin Publisher'
end

def make_book_tags
  Book.all.each do |b|
    b.country = Country.find(1 + Random.rand(10))
    b.levels << Level.find(1 + Random.rand(4))
    b.language = Language.find(1 + Random.rand(2))
    b.genre = Genre.find(1 + Random.rand(2))
    b.subcategory = Subcategory.find(1 + Random.rand(3))
    b.authors << Author.find(1 + Random.rand(4))
    b.publisher = Publisher.find(1 + Random.rand(2))
    b.save
  end
end

def make_projects
  1.upto(6) do |n|
    project = Project.create name: "project#{n}",
                             country: Country.find(n)
    project.languages << Language.find(1 + Random.rand(2))
    project.levels << Level.find(1 + Random.rand(4))
    project.save
  end
end

def make_content_buckets
  1.upto(10) do |n|
    content_bucket = ContentBucket.create name: "bucket#{n}"
    content_bucket.project = Project.find(1 + Random.rand(6))
    book_index = Random.rand(10)
    content_bucket.books << Book.find(1 + book_index)
    content_bucket.books << Book.find(1 + (book_index + 1) % 10)
    content_bucket.books << Book.find(1 + (book_index + 2) % 10)
    content_bucket.save
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

def make_subcategories
  names = ["Science Fiction", "Historical Fiction", "Fantasy"]
  1.upto(3) do |n|
    Subcategory.create! name: names[n - 1],
                        genre_id: 1
  end
end

def make_booklists
  b = BookList.create! name: "booklist1",
                       published: false
  b.users << User.find(2)
  1.upto(5) do |n|
    b.books << Book.find(n)
  end
  b.save
end

make_books
make_countries
make_levels
make_languages
make_genres
make_subcategories
make_authors
make_publishers
make_book_tags
make_projects
make_users
make_content_buckets
make_purchases
make_booklists
