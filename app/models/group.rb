# == Schema Information
#
# Table name: groups
#
#  id          :integer          not null, primary key
#  user_id     :integer
#  name        :string(255)
#  country     :string(255)
#  description :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

class Group < ActiveRecord::Base
  belongs_to :user
  has_and_belongs_to_many :books
end
