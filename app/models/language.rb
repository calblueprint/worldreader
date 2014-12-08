class Language < ActiveRecord::Base
  has_many :books
  has_and_belongs_to_many :recommendations
end
