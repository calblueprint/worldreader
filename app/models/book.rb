class Book < ActiveRecord::Base
  has_and_belongs_to_many :groups
  has_many :users, through: :purchases
  has_many :purchases
end
