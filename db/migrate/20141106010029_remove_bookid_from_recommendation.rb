class RemoveBookidFromRecommendation < ActiveRecord::Migration
  def change
    remove_column :recommendations, :book_id, :integer
  end
end
