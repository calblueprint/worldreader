# == Schema Information
#
# Table name: recommendations
#
#  id                  :integer          not null, primary key
#  organization        :string(255)
#  school              :string(255)
#  created_at          :datetime
#  updated_at          :datetime
#  recommendation_type :integer
#

require 'rails_helper'

RSpec.describe Recommendation, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
