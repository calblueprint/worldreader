# == Schema Information
#
# Table name: purchases
#
#  id           :integer          not null, primary key
#  user_id      :integer          not null
#  book_id      :integer          not null
#  purchased_on :date
#

# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :purchase do
  end
end
