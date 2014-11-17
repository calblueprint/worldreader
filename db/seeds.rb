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
  20.times.each do
    Country.create! name: Faker::Address.country
  end
end

def make_level_tags
  Level.create! name: 'Elementary'
  Level.create! name: 'Secondary'
  Level.create! name: 'High'
end

def make_language_tags
  Language.create! name: 'Somali'
  Language.create! name: 'Hausa'
end

def make_genre_tags
  Genre.create! name: 'Fiction'
  Genre.create! name: 'Non-fiction'
end

make_books
make_users
make_groups
make_purchases
make_location_tags
make_level_tags
make_language_tags
make_genre_tags
