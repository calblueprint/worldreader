FactoryGirl.define do
  factory :project do
    name "super cool project"
    after(:build) do |project|
      project.country = create(:country)
      project.languages = [create(:language)]
    end
  end

  factory :content_bucket, class: 'ContentBuckets' do
  end

  factory :subcategory do
    name "MyString"
    created_at "2015-03-03 16:05:30"
    udpated_at "2015-03-03 16:05:30"
  end

  factory :failed_update do
    book_id 1
  end

  factory :authors_book, class: 'AuthorsBooks' do
    book_id 1
    author_id 1
  end

  factory :publisher do
    name "MyString"
  end

  factory :author do
    name "MyString"
  end

  factory :books_country, class: 'BooksCountries' do
    country_id 1
    book_id 1
  end

  factory :books_level, class: 'BooksLevels' do
    book_id 1
    level_id 1
  end

  factory :project_users do
    project_id 1
    user_id 1
  end

  factory :level do
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
    sequence(:email) { |n| "email#{n}@example.com" }
    password "password"
    role 0
    after(:build) do |user|
      user.projects = [create(:project)]
      user.book_lists = [create(:book_list)]
    end
  end

  factory :book_list do
    name "MyString"
    after(:build) do |book_list|
      book_list.books = [create(:book)]
    end
  end

  factory :book do
    title "Day by Day"
    description "The tale of team with nothing left to lose"
  end
end
