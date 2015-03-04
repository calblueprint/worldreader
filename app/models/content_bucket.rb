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

class ContentBucket < ActiveRecord::Base
  belongs_to :project
  has_and_belongs_to_many :books
end
