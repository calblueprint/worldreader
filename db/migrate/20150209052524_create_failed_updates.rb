class CreateFailedUpdates < ActiveRecord::Migration
  def change
    create_table :failed_updates do |t|
      t.integer :book_id

      t.timestamps
    end
  end
end
