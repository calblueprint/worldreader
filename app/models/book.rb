# == Schema Information
#
# Table name: books
#
#  id                                       :integer          not null, primary key
#  asin                                     :string(255)
#  title                                    :string(255)
#  price                                    :decimal(10, 2)
#  rating                                   :integer
#  flagged                                  :boolean          default(FALSE)
#  copublished                              :boolean
#  publisher_id                             :integer
#  language_id                              :integer
#  genre_id                                 :integer
#  description                              :text
#  created_at                               :datetime         not null
#  updated_at                               :datetime         not null
#  date_added                               :date
#  restricted                               :boolean
#  limited                                  :integer
#  fiction_type_id                          :integer
#  textbook_level_id                        :integer
#  textbook_subject_id                      :integer
#  book_status_id                           :integer
#  source_file                              :boolean
#  source_cover                             :boolean
#  mobi                                     :boolean
#  epub                                     :boolean
#  fixed_epub                               :boolean
#  comments                                 :text
#  mou_fname                                :string(255)
#  origin_id                                :integer
#  appstatus_id                             :integer
#  appstatus                                :string(255)
#  keywords                                 :string(255)
#  read_level_id                            :integer
#  textbook_sumlevel_id                     :integer
#  category_id                              :integer
#  subcategory_id                           :integer
#  in_store                                 :boolean          default(FALSE)
#  binu_source_file_name                    :string(255)
#  binu_paperback_equivalent                :string(255)
#  binu_sort_title                          :string(255)
#  binu_series                              :string(255)
#  binu_creator_1_name                      :string(255)
#  binu_creator_1_role                      :string(255)
#  binu_publisher                           :string(255)
#  binu_imprint                             :string(255)
#  binu_pub_date                            :string(255)
#  binu_srp_inc_vat                         :string(255)
#  binu_currency                            :string(255)
#  binu_on_sale_date                        :string(255)
#  binu_langauge                            :string(255)
#  binu_geo_rights                          :string(255)
#  binu_subject1                            :string(255)
#  binu_subject2                            :string(255)
#  binu_bisac                               :string(255)
#  binu_bic                                 :string(255)
#  binu_bic2                                :string(255)
#  binu_fiction_subject2                    :string(255)
#  binu_keyword                             :string(255)
#  binu_short_description                   :string(255)
#  binu_not_for_sale                        :string(255)
#  binu_ready_for_sale                      :string(255)
#  binu_country                             :string(255)
#  certified_by_national_board_of_education :boolean
#  book_id                                  :integer
#  geo_restricted                           :boolean
#  geo_restrictedby                         :string(255)
#  pricingmodel                             :string(4)
#  textguide_book_id                        :string(45)
#  image                                    :string(255)
#

class Book < ActiveRecord::Base
    include Elasticsearch::Model

  belongs_to :language
  belongs_to :genre
  belongs_to :publisher
  belongs_to :subcategory
  belongs_to :country, foreign_key: "origin_id"
  has_many :purchases
  has_many :users, through: :purchases
  has_one :failed_update
  has_and_belongs_to_many :authors
  has_and_belongs_to_many :content_buckets
  has_and_belongs_to_many :levels
  has_and_belongs_to_many :recommendations

  default_scope { where(in_store: true) }

  CSV_COLUMNS = ["Book Name", "ASIN"]

  def self.to_csv(books)
    CSV.generate do |csv|
      csv << CSV_COLUMNS
      books.each do |book|
        csv << book.to_csv
      end
    end
  end

  def to_csv
    [title, asin]
  end

  settings number_of_shards: 1 do
    mapping do
      indexes :title, analyzer: 'english'
      indexes :description, analyzer: 'english'
      indexes :genre_name, index: 'not_analyzed'
      indexes :language_name, index: 'not_analyzed'
      indexes :country_name, index: 'not_analyzed'
      indexes :levels_name, index: 'not_analyzed'
      indexes :authors_name, index: 'not_analyzed'
      indexes :publisher_name, index: 'not_analyzed'
    end
  end

  def donated?
    price <= 0
  end

  def as_json(options={})
    super(
      methods: [
        :genre_name,
        :subcategory_name,
        :language_name,
        :country_name,
        :levels_name,
        :publisher_name,
        :authors_name,
        :update_status,
        :url
      ]
    )
  end

  def genre_name
    genre ? genre.name : ""
  end

  def subcategory_name
    subcategory ? subcategory.name : ""
  end

  def language_name
    language ? language.name : ""
  end

  def country_name
    country ? country.name : ""
  end

  def levels_name
    levels.map { |l| l.name }
  end

  def publisher_name
    publisher ? publisher.name : ""
  end

  def authors_name
    authors.map { |a| a.name }
  end

  def update_status
    failed_update.as_json
  end

  def url
    "http://www.amazon.com/dp/" + asin
  end

  def asin
    self[:asin] || ""
  end

  def self.query(string, tags, page)
    filtered = {}
    if not string.empty?
      filtered[:query] = {
        multi_match: {
          query: string,
          fields: [:title, :description, :authors_name, :publisher_name],
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
    query = { filtered: filtered }
    print query
    print "\n"
    highlight = {fields: {description: {fragment_size: 120}}}
    results = Book.search(query: query, highlight: highlight, from: 10 * page).to_a
    results.map! { |r| 
      r.has_key?(:highlight) ? 
        r._source.merge({highlight: r.highlight}) :
        r._source
    }
  end

end
