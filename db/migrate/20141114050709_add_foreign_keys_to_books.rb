class AddForeignKeysToBooks < ActiveRecord::Migration
  def change
    add_column :books, :language_id, :integer
    add_column :books, :genre_id, :integer
    add_column :books, :country_id, :integer
  end
end
