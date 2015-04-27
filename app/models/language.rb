# == Schema Information
#
# Table name: languages
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Language < ActiveRecord::Base
  has_many :books
  has_and_belongs_to_many :users

  def self.tags(index = 0)
    languages = Language.uniq.select([:id, :name]).map do |resource|
      index += 1
      { value: index, text: resource.name, tagType: "language", id: resource.id }
    end
    languages.sort_by { |resource| resource[:name] }
  end
end
