# == Schema Information
#
# Table name: book_lists
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  published  :boolean
#  created_at :datetime
#  updated_at :datetime
#

class BookList < ActiveRecord::Base
  has_and_belongs_to_many :books
  has_and_belongs_to_many :users, association_foreign_key: 'admin_user_id'
end
