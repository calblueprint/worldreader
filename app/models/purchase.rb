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

  CSV_COLUMNS = ["Book", "Partner", "Purchased On"]

  def self.to_csv(purchases)
    CSV.generate do |csv|
      csv << CSV_COLUMNS
      purchases.each do |purchase|
        csv << purchase.to_csv
      end
    end
  end

  def to_csv
    book = Book.find(book_id)["name"]
    partner_first = User.find(user_id)["first_name"]
    partner_last = User.find(user_id)["last_name"]
    [book, partner_first + " " + partner_last, purchased_on]
  end
end
