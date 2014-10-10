FactoryGirl.define do
  factory :user do
    name "John Du"
    sequence(:email) { |n| "email#{n}@example.com" }
    password "password"
    role 0
  end
end
