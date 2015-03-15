class ChangeRecommendationUserToProject < ActiveRecord::Migration
  def change
    rename_column :countries_recommendations, :user_country_id, :project_country_id
    rename_column :languages_recommendations, :user_language_id, :project_language_id
  end
end
