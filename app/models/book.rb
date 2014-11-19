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
    as_json(
      include: {
        genre: {only: :name},
        language: {only: :name},
        levels: {only: :name},
        countries: {only: :name}
      }
    )
  end

  def self.query(string, tags)
    tokens = []
    if string != ""
      tokens.push(string + "~")
    end
    tags.each do |tag|
      tokens.push(tag["tagType"] + ".name:" + tag["text"])
    end
    query = {query_string: {query: tokens.join(" AND ")}}
    results = Book.search(query: query).records.to_a
  end

end
