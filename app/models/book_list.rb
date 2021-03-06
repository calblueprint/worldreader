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
  validate :books?

  has_many :book_list_entries
  has_many :books, through: :book_list_entries
  has_and_belongs_to_many :users, association_foreign_key: 'admin_user_id'

  scope :published, -> { where published: true }

  def books?
    errors.add(:books, 'can\'t be blank') if books.blank?
  end

  def as_json(options = {})
    options[:methods] = [:image]
    super(options)
  end

  def image
    books.last.image
  end

  def self.tags(index = 0)
    book_lists = BookList.uniq.select([:id, :name]).map do |resource|
      index += 1
      { value: index, text: resource.name, tagType: "booklist", id: resource.id }
    end
    book_lists.sort_by { |resource| resource[:name] }
  end
end
