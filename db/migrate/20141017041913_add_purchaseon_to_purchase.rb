class AddPurchaseonToPurchase < ActiveRecord::Migration
  def change
    add_column :purchases, :purchased_on, :date
  end
end
