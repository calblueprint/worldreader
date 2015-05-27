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
#  level_tags_added                         :boolean          default(FALSE)
#

require 'test_helper'

class BookTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
