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

require 'rails_helper'

RSpec.describe Purchase, type: :model do
end
