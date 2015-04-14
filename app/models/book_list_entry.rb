# == Schema Information
#
# Table name: book_list_entries
#
#  id              :integer          not null, primary key
#  created_at      :datetime
#  updated_at      :datetime
#  flagged_user_id :integer
#  book_id         :integer
#  book_list_id    :integer
#

class BookListEntry < ActiveRecord::Base
  belongs_to :book_list
  belongs_to :book
  belongs_to :flagged_user, class_name: "User"
end
