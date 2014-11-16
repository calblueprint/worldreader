class CreateBooksCountries < ActiveRecord::Migration
  def change
    create_table :books_countries do |t|
      t.integer :country_id
      t.integer :book_id

      t.timestamps
    end
  end
end
