class CreateAdminUsersJoinTables < ActiveRecord::Migration
  def change
    create_table :admin_users_origins, id: false do |t|
      t.integer :user_id
      t.integer :country_id
    end
    create_table :admin_users_levels, id: false do |t|
      t.integer :user_id
      t.integer :level_id
    end
    create_table :admin_users_languages, id: false do |t|
      t.integer :user_id
      t.integer :language_id
    end
  end

  def add_indices
    add_index :admin_users_origins, :user_id
    add_index :admin_users_origins, :country_id

    add_index :admin_users_levels, :user_id
    add_index :admin_users_levels, :level_id

    add_index :admin_users_languages, :user_id
    add_index :admin_users_languages, :language_id
  end
end
