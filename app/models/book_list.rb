class BookList < ActiveRecord::Base
  has_and_belongs_to_many :books
  has_and_belongs_to_many :users, association_foreign_key: 'admin_user_id'
end
