# == Schema Information
#
# Table name: projects
#
#  id              :integer          not null, primary key
#  name            :string(255)
#  model_id        :integer
#  origin_id       :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  target_size     :integer
#  current_size    :integer
#  comments        :text
#  admin_user_id   :integer
#  project_type_id :integer
#

require 'rails_helper'

RSpec.describe Projects, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
