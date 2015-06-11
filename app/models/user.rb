# == Schema Information
#
# Table name: admin_users
#
#  id                     :integer          not null, primary key
#  email                  :string(255)      not null
#  encrypted_password     :string(255)      not null
#  reset_password_token   :string(255)
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0)
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string(255)
#  last_sign_in_ip        :string(255)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  can_edit_origins       :boolean
#  ops_rel                :boolean
#  publishing_rel         :boolean
#  DR_rel                 :boolean
#  role                   :integer
#  country_id             :integer
#  organization           :string(255)
#
class User < ActiveRecord::Base
  include Elasticsearch::Model
  validate :projects?

  self.table_name = "admin_users"

  enum role: [:user, :admin, :vip]
  after_initialize :set_default_role, if: :new_record?

  belongs_to :country
  has_many :book_list_entries
  has_and_belongs_to_many :projects, foreign_key: 'admin_user_id'
  has_and_belongs_to_many :book_lists, foreign_key: 'admin_user_id'
  scope :partners, -> { where role: :user }

  def self.query(query)
    User.partners.search(query).to_a.map(&:_source)
  end

  def admin?
    role == "admin" || role == "vip"
  end

  def as_json(_options = {})
    super(
      methods: [
        :country_names,
        :language_names,
        :project_names
      ]
    )
  end

  def country_names
    country_set = Set.new
    projects.each do |project|
      country_set.add project.country.name
    end
    country_set
  end

  def language_names
    language_set = Set.new
    projects.each do |project|
      project.languages.each do |language|
        language_set.add language.name
      end
    end
    language_set
  end

  def project_names
    projects.map(&:name)
  end

  def set_default_role
    self.role ||= :user
  end

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :async, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  private

  def projects?
    errors.add(:projects, 'can\'t be blank') if projects.blank?
  end
end
