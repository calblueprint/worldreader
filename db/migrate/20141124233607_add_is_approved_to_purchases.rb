class AddIsApprovedToPurchases < ActiveRecord::Migration
  def change
    add_column :purchases, :is_approved, :boolean
  end
end
