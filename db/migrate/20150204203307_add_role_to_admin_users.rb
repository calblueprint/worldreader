class AddRoleToAdminUsers < ActiveRecord::Migration
  def change
    add_column :admin_users, :role, :int
  end
end
