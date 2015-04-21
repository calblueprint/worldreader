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
  Level.create! name: "Primary 1"
  Level.create! name: "Standard 1"
  Level.create! name: "Primary 2"
  Level.create! name: "Standard 2"
  Level.create! name: "Primary 3"
  Level.create! name: "Standard 3"
  Level.create! name: "Primary 4"
  Level.create! name: "Standard 4"
  Level.create! name: "Primary 5"
  Level.create! name: "Standard 5"
  Level.create! name: "Primary 6"
  Level.create! name: "Standard 6"
  Level.create! name: "Primary 7"
  Level.create! name: "Standard 7"
  Level.create! name: "Primary 8"
  Level.create! name: "Standard 8"
  Level.create! name: "JHS 1"
  Level.create! name: "JHS 2"
  Level.create! name: "JHS 3"
  Level.create! name: "SHS 1"
  Level.create! name: "SHS 2"
  Level.create! name: "SHS 3"
  Level.create! name: "Form 1"
  Level.create! name: "Form 2"
  Level.create! name: "Form 3"
  Level.create! name: "Form 4"
  Level.create! name: "Primary"
  Level.create! name: "Junior High School"
  Level.create! name: "Secondary"
  Level.create! name: "Beginning Readers"
  Level.create! name: "Chapter Books"
  Level.create! name: "Young Adult"
  Level.create! name: "Adult"
  Level.create! name: "Lower Primary"
  Level.create! name: "Upper Primary"
  Level.create! name: "Pre-Primary"
  Level.create! name: "Primary 1 (Ghana)"
  Level.create! name: "Standard 1 (Kenya Primary)"
  Level.create! name: "Standard 1 (Tanzania)"
  Level.create! name: "Primary 2 (Ghana)"
  Level.create! name: "Standard 2 (Kenya Primary)"
  Level.create! name: "Standard 2 (Tanzania)"
  Level.create! name: "Primary 3 (Ghana)"
  Level.create! name: "Standard 3 (Kenya Primary)"
  Level.create! name: "Standard 3 (Tanzania)"
  Level.create! name: "Primary 4 (Ghana)"
  Level.create! name: "Standard 4 (Kenya Primary)"
  Level.create! name: "Standard 4 (Tanzania)"
  Level.create! name: "Primary 5 (Ghana)"
  Level.create! name: "Standard 5 (Kenya Primary)"
  Level.create! name: "Standard 5 (Tanzania)"
  Level.create! name: "Primary 6 (Ghana)"
  Level.create! name: "Standard 6 (Kenya Primary)"
  Level.create! name: "Standard 6 (Tanzania)"
  Level.create! name: "Standard 7 (Kenya Primary)"
  Level.create! name: "JHS 1 (Ghana)"
  Level.create! name: "Standard 7 (Tanzania)"
  Level.create! name: "Standard 8 (Kenya Primary)"
  Level.create! name: "JHS 2 (Ghana)"
  Level.create! name: "Standard 8 (Tanzania)"
  Level.create! name: "Form 1 (Kenya SHS)"
  Level.create! name: "Form 1 (Malawi SHS)"
  Level.create! name: "JHS 3 (Ghana)"
  Level.create! name: "Form 2 (Kenya SHS)"
  Level.create! name: "Form 2 (Malawi SHS)"
  Level.create! name: "SHS 1 (Ghana)"
  Level.create! name: "Form 3 (Kenya SHS)"
  Level.create! name: "Form 3 (Malawi SHS)"
  Level.create! name: "SHS 2 (Ghana)"
  Level.create! name: "Form 4 (Kenya SHS)"
  Level.create! name: "Form 4 (Malawi SHS)"
  Level.create! name: "SHS 3 (Ghana)"
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
  1.upto(5) do |i|
    b = BookList.new name: "booklist#{i}",
                     published: false
    b.users << User.find(i)
    books = Set.new
    1.upto(5) do
      books << Book.find(1 + rand(Book.count))
    end
    b.books << books.to_a
    b.save
  end
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
