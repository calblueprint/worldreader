FactoryGirl.define do
  factory :user do
    first_name "John"
    last_name "Du"
    sequence(:email) { |n| "email#{n}@example.com" }
    password "password"
    role 0
  end
end
