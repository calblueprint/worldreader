class RemoveImageFromBook < ActiveRecord::Migration
  def change
    remove_column :books, :image, :string
  end
end
