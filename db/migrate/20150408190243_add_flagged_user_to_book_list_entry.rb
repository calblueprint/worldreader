class AddFlaggedUserToBookListEntry < ActiveRecord::Migration
  def change
    add_column :book_list_entries, :flagged_user_id, :integer, references: :users, index: true
    add_column :book_list_entries, :book_id, :integer, references: :books, index: true
    add_column :book_list_entries, :book_list_id, :integer, references: :book_lists, index: true
  end
end
