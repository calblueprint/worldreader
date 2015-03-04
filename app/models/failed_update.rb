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
end
