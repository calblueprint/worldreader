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

  belongs_to :country, foreign_key: 'origin_id'
  has_many :content_buckets
  has_and_belongs_to_many :languages
  has_and_belongs_to_many :levels
  has_and_belongs_to_many :users, association_foreign_key: 'admin_user_id'

  settings number_of_shards: 1 do
    mapping do
      indexes :country_name, index: 'not_analyzed'
      indexes :languages_name, index: 'not_analyzed'
      indexes :levels_name, index: 'not_analyzed'
    end
  end

  def as_indexed_json(options={})
    as_json(
      methods: [
        :country_name,
        :languages_name,
        :levels_name
      ]
    )
  end

  def country_name
    country ? country.name : ""
  end

  def languages_name
    languages.map { |l| l.name }
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
          fields: [:name],
          fuzziness: 'AUTO'
        }
      }
    end
    tags_dict = {}
    tags.each do |tag|
      type = tag["tagType"]
      tag = "\"" + tag["text"] + "\""
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
    results = Project.search(query: query).to_a.map! { |r| r._source }
  end
end
