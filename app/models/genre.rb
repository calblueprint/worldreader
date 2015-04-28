# == Schema Information
#
# Table name: genres
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Genre < ActiveRecord::Base
  has_many :books
  has_many :subcategories

  def self.tags(index = 0)
    genres = Genre.uniq.select([:id, :name]).map do |resource|
      index += 1
      { value: index, text: resource.name, tagType: "genre", id: resource.id }
    end
    genres.sort_by { |resource| resource[:name] }
  end
end
