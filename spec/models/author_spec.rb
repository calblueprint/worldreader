# == Schema Information
#
# Table name: authors
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  origin_id  :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  comments   :text
#

require 'rails_helper'

RSpec.describe Author, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
