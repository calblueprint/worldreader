class RemoveRolesFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :role, :int
  end
end
