class AddOrganizationToUsers < ActiveRecord::Migration
  def change
    add_column :admin_users, :organization, :string
  end
end
