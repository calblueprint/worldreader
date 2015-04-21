# == Schema Information
#
# Table name: failed_updates
#
#  id         :integer          not null, primary key
#  book_id    :integer
#  created_at :datetime
#  updated_at :datetime
#

class FailedUpdate < ActiveRecord::Base
  belongs_to :book

  def self.create_or_update(book)
    failure = FailedUpdate.where(book_id: book.id).first
    if failure
      failure.touch
    else
      failure = FailedUpdate.create! book_id: book.id
    end
  end
end
