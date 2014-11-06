# == Schema Information
#
# Table name: recommendations
#
#  id           :integer          not null, primary key
#  book_id      :integer
#  level        :string(255)
#  language     :string(255)
#  genre        :string(255)
#  country      :string(255)
#  organization :string(255)
#  school       :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#

class Recommendation < ActiveRecord::Base
  has_and_belongs_to_many :books
end
