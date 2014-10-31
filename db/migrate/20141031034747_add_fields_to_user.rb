class AddFieldsToUser < ActiveRecord::Migration
  def change
    add_column :users, :school, :string
    add_column :users, :organization, :string
    add_column :users, :country, :string
  end
end
