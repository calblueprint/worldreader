class CreateUsersJoinTables < ActiveRecord::Migration
  def change
    create_table :countries_users, id: false do |t|
      t.integer :user_id
      t.integer :country_id
    end

    add_index :countries_users, :user_id
    add_index :countries_users, :country_id

    create_table :levels_users, id: false do |t|
      t.integer :user_id
      t.integer :level_id
    end

    add_index :levels_users, :user_id
    add_index :levels_users, :level_id

    create_table :languages_users, id: false do |t|
      t.integer :user_id
      t.integer :language_id
    end

    add_index :languages_users, :user_id
    add_index :languages_users, :language_id

  end
end
