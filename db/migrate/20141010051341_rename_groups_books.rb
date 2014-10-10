class RenameGroupsBooks < ActiveRecord::Migration
  def change
    rename_table :groups_books, :books_groups
  end
end
