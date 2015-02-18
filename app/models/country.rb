class Country < ActiveRecord::Base
  
  self.table_name = "origins"

  has_and_belongs_to_many :books
  has_and_belongs_to_many :users
  has_and_belongs_to_many :recommendations
end
