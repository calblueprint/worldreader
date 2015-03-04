class AddFlaggedUserForeignKeyToPurchases < ActiveRecord::Migration
  def change
    add_column :purchases, :flagged_user_id, :integer, references: :users
  end
end
