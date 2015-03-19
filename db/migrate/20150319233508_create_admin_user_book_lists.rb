class CreateAdminUserBookLists < ActiveRecord::Migration
  def change
    create_table :admin_users_book_lists do |t|
      t.belongs_to :admin_user, index: false
      t.belongs_to :book_list, index: false
    end
  end
end
