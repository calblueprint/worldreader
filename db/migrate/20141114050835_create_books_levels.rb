class CreateBooksLevels < ActiveRecord::Migration
  def change
w    create_table :books_levels do |t|
      t.integer :book_id
      t.integer :level_id

      t.timestamps
    end
  end
end
