# == Schema Information
#
# Table name: books
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  isbn        :string(255)
#  description :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

class Book < ActiveRecord::Base
  has_and_belongs_to_many :groups
  has_many :users, through: :purchases
  has_many :purchases
end
