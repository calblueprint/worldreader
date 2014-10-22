class AddPurchaseBooleanToPurchases < ActiveRecord::Migration
  def change
    add_column :purchases, :is_purchased, :boolean
  end
end
