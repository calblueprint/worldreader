# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string(255)      default(""), not null
#  encrypted_password     :string(255)      default(""), not null
#  reset_password_token   :string(255)
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string(255)
#  last_sign_in_ip        :string(255)
#  created_at             :datetime
#  updated_at             :datetime
#  role                   :integer
#  first_name             :string(255)
#  last_name              :string(255)
#  school                 :string(255)
#  organization           :string(255)
#  country                :string(255)
#

class User < ActiveRecord::Base
  enum role: [:user, :vip, :admin]
  after_initialize :set_default_role, :if => :new_record?
  after_create :send_welcome_mail

  has_many :groups
  has_many :books, through: :purchases
  has_many :purchases
  scope :partners, -> { where role: 1 }
  scope :partners_new_purchases, -> { partners.joins(:purchases).where('purchases.is_purchased = ?', false).uniq }

  def send_welcome_mail
    UserMailer.welcome(self).deliver
  end
  handle_asynchronously :send_welcome_mail

  def set_default_role
    self.role ||= :user
  end

  def name
    "#{first_name} #{last_name}"
  end

  def cart
    purchases.where(is_purchased: false).collect{ |purchase| purchase.book }
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


end
