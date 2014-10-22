# == Schema Information
#
# Table name: books
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  isbn        :string(255)
#  description :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  image       :string(255)
#

require 'test_helper'

class BookTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
