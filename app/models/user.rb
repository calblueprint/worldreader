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
#  first_name             :string(255)
#  last_name              :string(255)
#  school                 :string(255)
#  organization           :string(255)
#  country                :string(255)
#

class User < ActiveRecord::Base
    include Elasticsearch::Model

  after_create :send_welcome_mail

  belongs_to :country
  has_many :books, through: :purchases
  has_many :groups
  has_many :purchases
  scope :users_new_purchases, -> { users.joins(:purchases).where(
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

  def country_name
    country.name
  end

  def send_welcome_mail
    UserMailer.welcome(self).deliver
  end
  handle_asynchronously :send_welcome_mail

  def name
    "#{first_name} #{last_name}"
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
          fields: [:first_name, :last_name, :email],
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

  def self.users_no_new_purchases
    if (users_new_purchases.empty?)
      users
    else
      users.where("id not in (?)", users_new_purchases.pluck(:id))
    end
  end

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable


end
