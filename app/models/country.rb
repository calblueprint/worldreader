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

  def self.tags(index = 0)
    countries = Country.uniq.select([:id, :name]).map do |resource|
      index += 1
      { value: index, text: resource.name, tagType: "country", id: resource.id }
    end
    countries.sort_by { |resource| resource[:name] }
  end
end
