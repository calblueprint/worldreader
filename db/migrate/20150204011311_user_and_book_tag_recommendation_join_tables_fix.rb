class UserAndBookTagRecommendationJoinTablesFix < ActiveRecord::Migration
  def change
  	remove_column :countries_recommendations, :country_id, :integer
  	add_column :countries_recommendations, :user_country_id, :integer
  	add_column :countries_recommendations, :book_country_id, :integer

  	remove_column :languages_recommendations, :language_id, :integer
  	add_column :languages_recommendations, :user_language_id, :integer
  	add_column :languages_recommendations, :book_language_id, :integer
  end
end
