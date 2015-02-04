# == Schema Information
#
# Table name: recommendations
#
#  id           :integer          not null, primary key
#  level        :string(255)
#  language     :string(255)
#  genre        :string(255)
#  country      :string(255)
#  organization :string(255)
#  school       :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#

require 'rails_helper'

RSpec.describe Recommendation, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
