# == Schema Information
#
# Table name: book_lists
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  published   :boolean
#  created_at  :datetime
#  updated_at  :datetime
#  description :string(255)
#

class BookList < ActiveRecord::Base
  validates :name, presence: true
  validate :has_books?

  has_many :book_list_entries
  has_many :books, through: :book_list_entries
  has_and_belongs_to_many :users, association_foreign_key: 'admin_user_id'

  scope :published, -> { where published: true }
  def has_books?
    errors.add(:books, 'can\'t be blank') if books.blank?
  end

  def as_json(options={})
    options[:methods] = [:image]
    super(options)
  end

  def image
    books.first.image
  end
end
