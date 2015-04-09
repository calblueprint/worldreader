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
  validates :name, presence: true
  validate :has_books?

  has_and_belongs_to_many :books
  has_and_belongs_to_many :users, association_foreign_key: 'admin_user_id'

  def has_books?
    errors.add(:books, 'can\'t be blank') if books.blank?
  end
end
