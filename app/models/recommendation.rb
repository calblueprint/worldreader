# == Schema Information
#
# Table name: recommendations
#
#  id                  :integer          not null, primary key
#  organization        :string(255)
#  school              :string(255)
#  created_at          :datetime
#  updated_at          :datetime
#  recommendation_type :integer
#

class Recommendation < ActiveRecord::Base
  has_and_belongs_to_many :books
  has_and_belongs_to_many :proj_countries,
                          class_name: "Country",
                          join_table: "countries_recommendations",
                          association_foreign_key: "project_country_id"
  has_and_belongs_to_many :book_countries,
                          class_name: "Country",
                          join_table: "countries_recommendations",
                          association_foreign_key: "book_country_id"
  has_and_belongs_to_many :proj_languages,
                          class_name: "Language",
                          join_table: "languages_recommendations",
                          association_foreign_key: "project_language_id"
  has_and_belongs_to_many :book_languages,
                          class_name: "Language",
                          join_table: "languages_recommendations",
                          association_foreign_key: "book_language_id"
  has_and_belongs_to_many :book_genres,
                          class_name: "Genre",
                          join_table: "genres_recommendations"
end
