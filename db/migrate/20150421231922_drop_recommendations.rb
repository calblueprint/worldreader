class DropRecommendations < ActiveRecord::Migration
  def change
    drop_table :books_recommendations
    drop_table :countries_recommendations
    drop_table :genres_recommendations
    drop_table :languages_recommendations
    drop_table :recommendations
  end
end
