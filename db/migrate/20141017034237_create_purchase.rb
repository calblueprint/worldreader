class CreatePurchase < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
      t.references :user, :null => false
      t.references :book, :null => false
    end
  end
end
