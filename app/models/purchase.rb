# == Schema Information
#
# Table name: purchases
#
#  id              :integer          not null, primary key
#  user_id         :integer          not null
#  book_id         :integer          not null
#  purchased_on    :date
#  is_purchased    :boolean
#  is_approved     :boolean
#  approved_on     :datetime
#  flagged         :boolean
#  flagged_user_id :integer
#

class Purchase < ActiveRecord::Base
  belongs_to :user
  belongs_to :flagged_user, class_name: "User"
  belongs_to :book
  scope :is_purchased, -> (t_or_f) { where is_purchased: t_or_f }

  CSV_COLUMNS = ["Book Name", "Book Price", "Partner Email", "Purchased On"]

  def self.to_csv(purchases)
    CSV.generate do |csv|
      csv << CSV_COLUMNS
      purchases.each do |purchase|
        csv << purchase.to_csv
      end
    end
  end

  def to_csv
    [book.title, "$#{book.price}", user.email, purchased_on]
  end
end
