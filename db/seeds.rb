SEEDS = YAML.load(File.read(File.expand_path('../seeds.yml', __FILE__)))

def make_books
  SEEDS[:books].each do |book|
    Book.create!  book
  end
end

def make_users
  1.upto(5) do |n|
    puts "user#{n}@gmail.com"
    User.create!  first_name: "User #{n}",
                  last_name: "Seed",
                  email: "user#{n}@gmail.com",
                  role: 1,
                  password: "password'"
  end
  1.upto(2) do |n|
    puts "admin#{n}@gmail.com"
    User.create!  first_name: "Admin #{n}",
                  last_name: "Seed",
                  email: "admin#{n}@gmail.com",
                  role: 2,
                  password: "password"
  end
end

def make_groups
  User.all.each do |user|
    1.upto(3) do |n|
      user.groups.create(name: 'Group #{n}')
    end
  end
end

make_books
make_users
make_groups
