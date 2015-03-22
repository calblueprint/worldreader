class CreateBookLists < ActiveRecord::Migration
  def change
    create_table :book_lists do |t|
      t.string :name
      t.boolean :published
      t.timestamps
    end

    create_table :book_lists_books, id: false do |t|
      t.belongs_to :book, index: false
      t.belongs_to :book_list, index: false
    end
  end
end
