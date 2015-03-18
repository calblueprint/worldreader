class CreateGenresRecommendations < ActiveRecord::Migration
  def change
    create_table :genres_recommendations, id: false do |t|
      t.references :recommendation, null: false
      t.references :genre, null: false
    end
  end
end
