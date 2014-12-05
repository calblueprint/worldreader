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
  
  CSV_COLUMNS = ["ASIN", "TITLE", "PUBLISHER", "PRICE"]

  def self.to_csv(purchases)
    CSV.generate do |csv|
      csv << CSV_COLUMNS
      purchases.each do |purchase|
        csv << purchase.to_csv
      end
    end
  end

  def to_csv
    [book.asin, book.name, book.publisher.name, book.price]
  end

  def self.csv_filename(purchase)
    purchase.user.organization + "_" + purchase.purchased_on.to_s
  end
end
