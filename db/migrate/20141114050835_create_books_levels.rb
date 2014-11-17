class CreateBooksLevels < ActiveRecord::Migration
  def change
    create_table :books_levels do |t|
      t.integer :book_id
      t.integer :level_id

      t.timestamps
    end
  end
end
