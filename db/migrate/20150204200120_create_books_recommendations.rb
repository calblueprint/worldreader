class CreateBooksRecommendations < ActiveRecord::Migration
  def change
    create_table :books_recommendations, id: false do |t|
      t.references :book, :null => false
      t.references :recommendation, :null => false
    end

    add_index :books_recommendations, [:book_id, :recommendation_id]
  end
end
