# == Schema Information
#
# Table name: origins
#
#  id           :integer          not null, primary key
#  name         :string(255)
#  continent_id :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Country < ActiveRecord::Base
  
  self.table_name = "origins"

  has_and_belongs_to_many :books
  has_and_belongs_to_many :users
end
