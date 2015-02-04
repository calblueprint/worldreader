FactoryGirl.define do  factory :admin_user do
    
  end
  factory :authors_book, :class => 'AuthorsBooks' do
    book_id 1
author_id 1
  end
  factory :publisher do
    name "MyString"
  end
  factory :author do
    name "MyString"
  end

  factory :recommendation do
    # TODO create recommendation
  end
  factory :books_country, :class => 'BooksCountries' do
    country_id 1
    book_id 1
  end
  factory :books_level, :class => 'BooksLevels' do
    book_id 1
    level_id 1
  end
  factory :level, :class => 'Levels' do
    name "MyString"
  end
  factory :country do
    name "MyString"
  end
  factory :genre do
    name "MyString"
  end
  factory :language do
    name "MyString"
  end

  factory :user do
    first_name "John"
    last_name "Du"
    sequence(:email) { |n| "email#{n}@example.com" }
    password "password"
    role 0
  end

  factory :book do
    name "Day by Day"
    description "The tale of team with nothing left to lose"
  end
end
