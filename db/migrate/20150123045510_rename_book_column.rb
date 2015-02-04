class RenameBookColumn < ActiveRecord::Migration
  def change
    rename_column :books, :name, :title
  end
end
