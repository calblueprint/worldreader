class AddGenreForeignKeyToSubcategory < ActiveRecord::Migration
  def change
    add_column :subcategories, :genre_id, :integer, references: :genres
    remove_column :subcategories, :category_id
  end
end
