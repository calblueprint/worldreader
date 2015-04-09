class BookListEntry < ActiveRecord::Base
  belongs_to :book_list
  belongs_to :book
  belongs_to :flagged_user, class_name: "User"
end
