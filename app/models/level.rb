# == Schema Information
#
# Table name: levels
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Level < ActiveRecord::Base
  has_and_belongs_to_many :books
  has_and_belongs_to_many :projects

  def self.tags(index = 0)
    levels = Level.uniq.select([:id, :name]).map do |resource|
      index += 1
      { value: index, text: resource.name, tagType: "levels", id: resource.id }
    end
    levels.sort_by { |resource| resource[:name] }
  end
end
