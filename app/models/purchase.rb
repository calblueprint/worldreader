# == Schema Information
#
# Table name: purchases
#
#  id           :integer          not null, primary key
#  user_id      :integer          not null
#  book_id      :integer          not null
#  purchased_on :date
#

class Purchase < ActiveRecord::Base
  belongs_to :user
  belongs_to :book
end
