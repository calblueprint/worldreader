# == Schema Information
#
# Table name: authors
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  origin_id  :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  comments   :text
#

class Author < ActiveRecord::Base
  has_and_belongs_to_many :books
end
