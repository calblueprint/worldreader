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

  settings number_of_shards: 1 do
    mapping do
      indexes :name, analyzer: 'english'
      indexes :description, analyzer: 'english'
      indexes :genre_name, index: 'not_analyzed'
      indexes :language_name, index: 'not_analyzed'
      indexes :countries_name, index: 'not_analyzed'
      indexes :levels_name, index: 'not_analyzed'
    end
  end

  def donated?
    price <= 0
  end

  def as_json(options={})
    super(
      methods: [:genre_name, :language_name, :countries_name, :levels_name]
    )
  end

  def genre_name
    genre.name
  end

  def language_name
    language.name
  end

  def countries_name
    countries.map { |c| c.name }
  end

  def levels_name
    levels.map { |l| l.name }
  end

  def self.query(string, tags)
    filtered = {}
    if not string.empty?
      filtered[:query] = {
        multi_match: {
          query: string,
          fields: [:name, :description],
          fuzziness: 'AUTO'
        }
      }
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
    if not tags_dict.empty?
      and_filter = []
      tags_dict.each do |type, tags|
        query = {
          query: {
            query_string: {
              default_field: type + "_name",
              query: tags.join(" OR ")
            }
          }
        }
        and_filter.push(query)
      end
      filtered[:filter] = {
        and: and_filter
      }
    end
    query = {filtered: filtered}
    print query
    print "\n"
    highlight = {fields: {description: {fragment_size: 120}}}
    results = Book.search(query: query, highlight: highlight).to_a
    results.map! { |r| 
      r.has_key?(:highlight) ? 
        r._source.merge({highlight: r.highlight}) :
        r._source
    }
  end

end
