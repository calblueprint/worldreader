class AddTypeToRecommendation < ActiveRecord::Migration
  def change
    add_column :recommendations, :recommendation_type, :integer
  end
end
