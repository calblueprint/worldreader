class Country < ActiveRecord::Base
  
  self.table_name = "origins"

  has_many :books
  has_many :users
  has_and_belongs_to_many :recommendations
end
