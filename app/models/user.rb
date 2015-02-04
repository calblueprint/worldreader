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
#

class User < ActiveRecord::Base
    include Elasticsearch::Model

  self.table_name = "admin_users"

  enum role: [:user, :vip, :admin]
  after_initialize :set_default_role, :if => :new_record?
  after_create :send_welcome_mail

  belongs_to :country
  has_many :books, through: :purchases
  has_many :groups
  has_many :purchases
  scope :partners, -> { where role: 1 }
  scope :partners_new_purchases, -> { partners.joins(:purchases).where(
    'purchases.is_purchased = ? and purchases.is_approved is null', true).uniq }

  settings number_of_shards: 1 do
    mapping do
      indexes :country_name, index: 'not_analyzed'
    end
  end

  def as_indexed_json(options={})
    as_json(
      methods: [:country_name]
    )
  end

  def as_json(options={})
    json = super(options)
    json[:past_purchase_ids] = purchases.map { |purchase| purchase.book.id }
    json
  end

  def country_name
    country.name
  end

  def send_welcome_mail
    UserMailer.welcome(self).deliver
  end
  handle_asynchronously :send_welcome_mail

  def set_default_role
    self.role ||= :user
  end

  def cart
    purchases.where(is_purchased: false).map{ |purchase| purchase.book }
  end

  def self.query(string, tags)
    filtered = {}
    if not string.empty?
      filtered[:query] = {
        multi_match: {
          query: string,
          fields: [:email],
          fuzziness: 'AUTO'
        }
      }
    end
    if not tags.empty?
      or_filter = []
      tags.each do |country|
        query = {
          term: {
            "country_name" => country
          }
        }
        or_filter.push(query)
      end
      filtered[:filter] = {
        or: or_filter
      }
    end
    query = {filtered: filtered}
    print query
    print "\n"
    User.search(query: query).to_a.map! { |r| r._source }
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
