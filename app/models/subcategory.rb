# == Schema Information
#
# Table name: subcategories
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  book_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  genre_id   :integer
#

class Subcategory < ActiveRecord::Base
  belongs_to :genre, foreign_key: "category_id"
  has_many :books
end
