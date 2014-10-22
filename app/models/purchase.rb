# == Schema Information
#
# Table name: purchases
#
#  id           :integer          not null, primary key
#  user_id      :integer          not null
#  book_id      :integer          not null
#  purchased_on :date
#  is_purchased :boolean
#

class Purchase < ActiveRecord::Base
  belongs_to :user
  belongs_to :book
  scope :is_purchased, -> (t_or_f) { where is_purchased: t_or_f }
end
