class RemoveSchoolFromUser < ActiveRecord::Migration
  def change
    remove_column :users, :school, :string
  end
end
