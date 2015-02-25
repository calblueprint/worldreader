class DropUserJoinTables < ActiveRecord::Migration
  def change
  	drop_table :admin_users_languages
	drop_table :admin_users_levels
	drop_table :admin_users_origins
  end
end
