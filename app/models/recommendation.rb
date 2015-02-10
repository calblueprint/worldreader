# == Schema Information
#
# Table name: recommendations
#
#  id           :integer          not null, primary key
#  level        :string(255)
#  language     :string(255)
#  genre        :string(255)
#  country      :string(255)
#  organization :string(255)
#  school       :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#

class Recommendation < ActiveRecord::Base
  has_and_belongs_to_many :books
  has_and_belongs_to_many :user_countries, class_name:"Country", foreign_key:'user_country_id'
  has_and_belongs_to_many :book_countries, class_name:"Country", foreign_key:'book_country_id'
  has_and_belongs_to_many :user_languages, class_name:"Language", foreign_key:'user_language_id'
  has_and_belongs_to_many :book_languages, class_name:"Language", foreign_key:'book_language_id'
end
