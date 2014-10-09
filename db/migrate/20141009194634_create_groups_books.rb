class CreateGroupsBooks < ActiveRecord::Migration
  def change
    create_table :groups_books, :id => false do |t|
    	t.references :group, :null => false
    	t.references :book, :null => false
    end

    add_index :groups_books, [:group_id, :book_id]
  end
end
