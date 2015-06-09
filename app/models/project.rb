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

class Project < ActiveRecord::Base
  include Elasticsearch::Model

  validates :name, presence: true, uniqueness: true
  validates :country, presence: true
  validate :languages?

  belongs_to :country, foreign_key: 'origin_id'
  has_many :content_buckets
  has_and_belongs_to_many :languages
  has_and_belongs_to_many :levels
  has_and_belongs_to_many :users, association_foreign_key: 'admin_user_id'

  def languages?
    errors.add(:languages, 'can\'t be blank') if languages.blank?
  end
end
