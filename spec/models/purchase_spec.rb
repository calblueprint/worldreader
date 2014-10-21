# == Schema Information
#
# Table name: purchases
#
#  id           :integer          not null, primary key
#  user_id      :integer          not null
#  book_id      :integer          not null
#  purchased_on :date
#

require 'rails_helper'

RSpec.describe Purchase, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
