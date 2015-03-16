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

  self.table_name = "admin_users"

  enum role: [:user, :admin, :vip]
  after_initialize :set_default_role, :if => :new_record?
  after_create :send_welcome_mail
  after_save :validate_user_fields

  belongs_to :country
  has_many :books, through: :purchases
  has_many :purchases
  has_and_belongs_to_many :projects, foreign_key: 'admin_user_id'

  scope :partners, -> { where role: :user }
  scope :partners_new_purchases, -> { partners.joins(:purchases).where(
    'purchases.is_purchased = ? and purchases.is_approved is null', true).uniq }

  def admin?
    role == "admin" || role == "vip"
  end

  def as_json(options={})
    super(
      methods: [
        :past_purchase_ids,
        :country_names,
        :language_names,
        :project_names
      ]
    )
  end

  def past_purchase_ids
    purchases.where(is_purchased: true).map do |purchase|
      purchase.book.id
    end
  end

  def country_names
    country_set = Set.new
    projects.each do |project|
      country_set.add project.country.name
    end
    return country_set
  end

  def language_names
    language_set = Set.new
    projects.each do |project|
      project.languages.each do |language|
        language_set.add language.name
      end
    end
    return language_set
  end

  def project_names
    projects.map &:name
  end

  def send_welcome_mail
    UserMailer.welcome(self).deliver
  end
  handle_asynchronously :send_welcome_mail

  def set_default_role
    self.role ||= :user
  end

  def cart
    cart_purchases.map{ |purchase| purchase.book }
  end

  def cart_groups
    cart_purchases.map { |purchase| purchase.content_buckets }
  end

  def cart_purchases
    purchases.where(is_purchased: false)
  end

  def self.partners_no_new_purchases
    if (partners_new_purchases.empty?)
      partners
    else
      partners.where("id not in (?)", partners_new_purchases.pluck(:id))
    end
  end

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  private

  def validate_user_fields
    errors.add(:projects, "can't be blank") if projects.size < 1
    raise ActiveRecord::RecordInvalid.new(self) if !errors.empty?
  end
end
