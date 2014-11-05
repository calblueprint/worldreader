class AddDescriptionToBooks < ActiveRecord::Migration
  def change
    change_column :books, :description, :text, limit: nil
  end
end
