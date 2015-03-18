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
      indexes "country.name", index: 'not_analyzed'
      indexes "languages.name", index: 'not_analyzed'
      indexes "levels.name", index: 'not_analyzed'
    end
  end

  def as_indexed_json(options={})
    as_json({
      include: {
        country: {only: :name},
        languages: {only: :name},
        levels: {only: :name}
      }
    })
  end

  def self.query(tags)
    filtered_query = {}
    tags_dict = Book.extract_tags(tags)
    if not tags_dict.empty?
      and_filter = []
      tags_dict.each do |type, tags|
        and_filter.push(Project.create_or_filter(type + ".name", tags))
      end
      filtered_query[:filter] = {and: and_filter}
    end
    query = {filtered: filtered_query}
    print query
    print "\n"
    results = Project.search(query: query).to_a.map! { |r| r._source }
  end

  def self.create_or_filter(term, tags)
    or_filter = []
    tags.each do |tag|
      or_filter.push({term: {term => tag}})
    end
    {or: or_filter}
  end

  def self.extract_tags(tags)
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
    tags_dict
  end
end
