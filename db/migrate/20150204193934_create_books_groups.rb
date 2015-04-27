class CreateBooksGroups < ActiveRecord::Migration
  def change
    create_table :books_groups, id: false do |t|
      t.references :book, null: false
      t.references :group, null: false
    end

    add_index :books_groups, [:group_id, :book_id]
  end
end
