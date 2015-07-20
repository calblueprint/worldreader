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
#  level_tags_added                         :boolean          default(FALSE)
#

class Book < ActiveRecord::Base
  include Elasticsearch::Model

  belongs_to :language
  belongs_to :genre
  belongs_to :publisher
  belongs_to :subcategory
  belongs_to :country, foreign_key: "origin_id"
  has_one :failed_update
  has_and_belongs_to_many :authors
  has_and_belongs_to_many :content_buckets
  has_and_belongs_to_many :levels
  has_many :book_list_entries
  has_many :book_lists, through: :book_list_entries

  settings number_of_shards: 1 do
    mapping do
      indexes "genre.name", index: 'not_analyzed'
      indexes "subcategory.name", index: 'not_analyzed'
      indexes "language.name", index: 'not_analyzed'
      indexes "country.name", index: 'not_analyzed'
      indexes "levels.name", index: 'not_analyzed'
    end
  end

  QUERY_FIELDS = [:title,
                  :description,
                  :asin,
                  "authors.name",
                  "publisher.name"]

  CSV_COLUMNS = ["ASIN",
                 "Title",
                 "Publisher",
                 "Author",
                 "Section",
                 "Genre",
                 "Reading Level",
                 "Description"]

  def self.to_csv(books)
    CSV.generate do |csv|
      csv << CSV_COLUMNS
      books.each do |book|
        csv << book.to_csv
      end
    end
  end

  def to_csv
    [
      asin,
      title,
      publisher_name,
      authors_name,
      genre_name,
      subcategory_name,
      levels_name,
      description
    ]
  end

  def as_json(options = {})
    options[:methods] = [:subcategory_name,
                         :levels_name,
                         :language_name,
                         :publisher_name,
                         :country_name,
                         :genre_name,
                         :update_status,
                         :updated_date,
                         :url,
                         :image,
                         :book_type]
    super(options)
  end

  def as_indexed_json(_options = {})
    as_json(
      include: {
        authors: { only: :name },
        country: { only: :name },
        genre: { only: :name },
        subcategory: { only: :name },
        language: { only: :name },
        levels: { only: :name },
        publisher: { only: :name }
      })
  end

  def authors_name
    authors.map(&:name)
  end

  def updated_date
    updated_at.strftime "%m/%d/%Y"
  end

  def subcategory_name
    subcategory ? subcategory.name : ""
  end

  def publisher_name
    publisher ? publisher.name : ""
  end

  def language_name
    language ? language.name : ""
  end

  def country_name
    country ? country.name : ""
  end

  def genre_name
    genre ? genre.name : ""
  end

  def levels_name
    levels.map(&:name)
  end

  def update_status
    failed_update.as_json
  end

  def url
    "http://www.amazon.com/dp/" + asin
  end

  def image
    "http://images.amazon.com/images/P/#{asin}"
  end

  def asin
    self[:asin] || ""
  end

  def book_type
    publisher.free == "paid"
  end

  def self.query(query_params = {})
    filtered_query = {}
    unless query_params[:term].empty?
      filtered_query[:query] = Book.create_multi_match_query(query_params[:term])
    end
    tags_dict = Book.extract_tags(query_params[:tags])
    unless tags_dict.empty?
      and_filter = []
      tags_dict.each do |type, book_tags|
        and_filter.push(Book.create_or_filter(type + ".name", book_tags))
      end
      filtered_query[:filter] = { and: and_filter }
    end
    query = { filtered: filtered_query }
    highlight = { fields: { description: { fragment_size: 120 } } }
    sort = query_params[:sort] || :_score
    puts sort
    results = Book.search(query: query,
                          highlight: highlight,
                          from: Constants::PAGE_SIZE * query_params[:page],
                          sort: sort,
                          size: Constants::PAGE_SIZE).results
    count = results.total
    books = results.to_a.map do |r|
      if r.key?(:highlight)
        r._source.merge(highlight: r.highlight)
      else
        r._source
      end
    end
    [books, count]
  end

  def add_level_tags(levels_convert)
    levels_to_add = Set.new
    levels.each do |level|
      corresp_levels = levels_convert["levelsConvert"][level.name][genre.name]
      corresp_levels.each do |level_to_add|
        levels_to_add.add(Level.find_by_name(level_to_add))
      end
    end
    levels.concat levels_to_add.to_a
    self.level_tags_added = true
    save
  end

  def self.create_multi_match_query(string)
    {
      multi_match: {
        query: string,
        fields: QUERY_FIELDS,
        fuzziness: 'AUTO'
      }
    }
  end

  def self.create_or_filter(term, tags)
    or_filter = []
    tags.each do |tag|
      or_filter.push(term: { term => tag })
    end
    { or: or_filter }
  end

  def self.extract_tags(tags)
    tags_dict = {}
    tags.each do |tag|
      type = tag["tagType"]
      tag = tag["text"]
      if tags_dict.key? type
        tags_dict[type].push(tag)
      else
        tags_dict[type] = [tag]
      end
    end
    tags_dict
  end
end
