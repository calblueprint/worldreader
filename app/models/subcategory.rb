class Subcategory < ActiveRecord::Base
  belongs_to :genre, foreign_key: "category_id"
  has_many :books
end
