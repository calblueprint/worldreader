class AddDescriptionToBookList < ActiveRecord::Migration
  def change
    add_column :book_lists, :description, :string
  end
end
