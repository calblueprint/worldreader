# == Schema Information
#
# Table name: content_buckets
#
#  id            :integer          not null, primary key
#  name          :string(255)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  project_id    :integer
#  friendly_name :string(255)
#

require 'rails_helper'

RSpec.describe ContentBucket, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
