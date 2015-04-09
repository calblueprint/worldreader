class CreateBookListEntries < ActiveRecord::Migration
  def change
    create_table :book_list_entries do |t|

      t.timestamps
    end
  end
end
