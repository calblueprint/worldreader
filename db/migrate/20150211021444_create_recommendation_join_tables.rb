class CreateRecommendationJoinTables < ActiveRecord::Migration
  def change
    remove_column :recommendations, :level, :string
    remove_column :recommendations, :language, :string
    remove_column :recommendations, :genre, :string
    remove_column :recommendations, :country, :string

    create_table :countries_recommendations, id: false do |t|
      t.references :country, null: false
      t.references :recommendation, null: false
    end

    create_table :languages_recommendations, id: false do |t|
      t.references :language, null: false
      t.references :recommendation, null: false
    end
  end
end
