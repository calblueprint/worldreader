class CreatePurchases < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
      t.references :user, :null => false
      t.references :book, :null => false
      t.date :purchased_on
      t.boolean :is_purchased
      t.boolean :is_approved
    end
  end
end
