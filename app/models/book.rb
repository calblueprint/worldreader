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

  @@stop_words = Set.new ["the", "and"]

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
    string.split(" ").each do |token|
      if not @@stop_words.member? token
        tokens.push(token + "~1")
      end
    end
    tags_dict = {}
    tags.each do |tag|
      type = tag["tagType"]
      tag = tag["text"]
      if tags_dict.has_key? type
        tags_dict[type].push(tag)
      else
        tags_dict[type] = [tag]
      end
    end
    tags_dict.each do |type, tags|
      tag_tokens = tags.map { |t| type + ".name:\"" + t + "\"" }
      tokens.push("(" + tag_tokens.join(" OR ") + ")")
    end
    print tokens.join(" AND ")
    print "\n"
    query = {query_string: {query: tokens.join(" AND ")}}
    highlight = {fields: {description: {fragment_size: 120}}}
    results = Book.search(query: query, highlight: highlight).to_a
    results.map! { |r| 
      r.has_key?(:highlight) ? 
        r._source.merge({highlight: r.highlight}) :
        r._source
    }
  end

end
