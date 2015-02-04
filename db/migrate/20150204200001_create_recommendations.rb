class CreateRecommendations < ActiveRecord::Migration
  def change
    create_table :recommendations do |t|
      t.string :level
      t.string :language
      t.string :genre
      t.string :country
      t.string :organization
      t.string :school
      
      t.timestamps
    end
  end
end