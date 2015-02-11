class AddApprovedOnToPurchases < ActiveRecord::Migration
  def change
    add_column :purchases, :approved_on, :datetime
  end
end
