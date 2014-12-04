class Country < ActiveRecord::Base
  has_and_belongs_to_many :books
  has_many :users
end
