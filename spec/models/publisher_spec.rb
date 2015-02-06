# == Schema Information
#
# Table name: publishers
#
#  id                         :integer          not null, primary key
#  name                       :string(255)
#  origin_id                  :integer
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  address                    :string(255)
#  telephone                  :string(255)
#  email                      :string(255)
#  account_name               :string(255)
#  account_number             :string(255)
#  bank                       :string(255)
#  branch                     :string(255)
#  swift_code                 :string(255)
#  branch_code                :string(255)
#  bank_code                  :string(255)
#  name_US_corresponding_bank :string(255)
#  routing_number             :string(255)
#  contract_end_date          :date
#  free                       :string(5)        default("free")
#  platform_mob_contractdate  :date
#  self_published             :boolean
#  imprints                   :string(255)
#  city                       :string(255)
#  postal_code                :string(255)
#  country_id                 :integer
#  alernate_add1              :string(255)
#  alernate_add2              :string(255)
#  website                    :string(255)
#  shared_ftp_link            :string(255)
#  platform_mobile            :integer
#  platform_ereader           :integer
#

require 'rails_helper'

RSpec.describe Publisher, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
