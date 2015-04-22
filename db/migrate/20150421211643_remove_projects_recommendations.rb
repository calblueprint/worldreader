class RemoveProjectsRecommendations < ActiveRecord::Migration
  def change
    drop_table :projects_recommendations
  end
end
