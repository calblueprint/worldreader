class AddLevelTagsAddedToBooks < ActiveRecord::Migration
  def change
    add_column :books, :level_tags_added, :boolean, :default => false
  end
end
