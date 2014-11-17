# == Schema Information
#
# Table name: books
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  isbn        :string(255)
#  description :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  image       :string(255)
#  asin        :string(255)
#

class Book < ActiveRecord::Base
    include Elasticsearch::Model
  belongs_to :language
  belongs_to :genre
  has_and_belongs_to_many :groups
  has_many :users, through: :purchases
  has_many :purchases
  has_and_belongs_to_many :recommendations
  has_and_belongs_to_many :countries
  has_and_belongs_to_many :levels

  def as_indexed_json(options={})
    u = ""
    users.each do |s|
      u += s.email + " "
    end
    as_json(
      include: {
        language: {only: :name},
        genre: {only: :name},
        countries: {only: :name},
        levels: {only: :name}
    })
  end

  def query(string, tags)
  	must = []
    tags.each do |tag, type|
      must.push({term: {type => tag}})
    end
    q = {
      query: {
        bool: {
          should: [
            {term: {description: string}},
            {term: {name: string}}
          ],
          must: must
        }
      }
    }
    # Book.search q
  end

end
