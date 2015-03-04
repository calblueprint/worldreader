class AddFlaggedToPurchases < ActiveRecord::Migration
  def change
    add_column :purchases, :flagged, :boolean
  end
end
