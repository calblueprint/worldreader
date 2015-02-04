# == Schema Information
#
# Table name: purchases
#
#  id           :integer          not null, primary key
#  user_id      :integer          not null
#  book_id      :integer          not null
#  purchased_on :date
#  is_purchased :boolean
#

class Purchase < ActiveRecord::Base
  belongs_to :user
  belongs_to :book
  scope :is_purchased, -> (t_or_f) { where is_purchased: t_or_f }
  
  CSV_COLUMNS = ["Book Name", "Partner First Name", "Partner Last Name", "Purchased On"]

  def self.to_csv(purchases)
    CSV.generate do |csv|
      csv << CSV_COLUMNS
      purchases.each do |purchase|
        csv << purchase.to_csv
      end
    end
  end

  def to_csv
    [book.title, user.first_name, user.last_name, purchased_on]
  end
end
