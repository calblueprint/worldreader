class AddCountryRefToAdminUsers < ActiveRecord::Migration
  def change
    add_reference :admin_users, :country, index: true
  end
end
