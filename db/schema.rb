# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150223062539) do

  create_table "accounts", force: true do |t|
    t.string   "acc_number"
    t.integer  "school_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "homeroom_id"
    t.string   "status"
    t.integer  "number_broken"
    t.boolean  "flagged"
    t.text     "comments"
  end

  add_index "accounts", ["homeroom_id", "school_id"], name: "index_accounts_on_homeroom_id_and_school_id", using: :btree

  create_table "active_admin_comments", force: true do |t|
    t.string   "resource_id",   null: false
    t.string   "resource_type", null: false
    t.integer  "author_id"
    t.string   "author_type"
    t.text     "body"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "namespace"
  end

  add_index "active_admin_comments", ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
  add_index "active_admin_comments", ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
  add_index "active_admin_comments", ["resource_type", "resource_id"], name: "index_admin_notes_on_resource_type_and_resource_id", using: :btree

  create_table "admin_users", force: true do |t|
    t.string   "email",                              null: false
    t.string   "encrypted_password",                 null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.boolean  "can_edit_origins"
    t.boolean  "ops_rel"
    t.boolean  "publishing_rel"
    t.boolean  "DR_rel"
    t.integer  "role"
    t.integer  "country_id"
    t.string   "organization"
  end

  add_index "admin_users", ["country_id"], name: "index_admin_users_on_country_id", using: :btree
  add_index "admin_users", ["email"], name: "index_admin_users_on_email", unique: true, using: :btree
  add_index "admin_users", ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true, using: :btree

  create_table "admin_users_languages", id: false, force: true do |t|
    t.integer "user_id"
    t.integer "language_id"
  end

  add_index "admin_users_languages", ["language_id"], name: "index_admin_users_languages_on_language_id", using: :btree
  add_index "admin_users_languages", ["user_id"], name: "index_admin_users_languages_on_user_id", using: :btree

  create_table "admin_users_levels", id: false, force: true do |t|
    t.integer "user_id"
    t.integer "level_id"
  end

  add_index "admin_users_levels", ["level_id"], name: "index_admin_users_levels_on_level_id", using: :btree
  add_index "admin_users_levels", ["user_id"], name: "index_admin_users_levels_on_user_id", using: :btree

  create_table "admin_users_origins", id: false, force: true do |t|
    t.integer "user_id"
    t.integer "country_id"
  end

  add_index "admin_users_origins", ["country_id"], name: "index_admin_users_origins_on_country_id", using: :btree
  add_index "admin_users_origins", ["user_id"], name: "index_admin_users_origins_on_user_id", using: :btree

  create_table "admin_users_projects", id: false, force: true do |t|
    t.integer "admin_user_id"
    t.integer "project_id"
  end

  add_index "admin_users_projects", ["admin_user_id", "project_id"], name: "admin_user_project_index", unique: true, using: :btree

  create_table "appstatuses", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "authors", force: true do |t|
    t.string   "name"
    t.integer  "origin_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text     "comments"
  end

  add_index "authors", ["origin_id"], name: "index_authors_on_origin_id", using: :btree

  create_table "authors_books", id: false, force: true do |t|
    t.integer "book_id"
    t.integer "author_id"
  end

  add_index "authors_books", ["book_id", "author_id"], name: "index_authors_books_on_book_id_and_author_id", using: :btree

  create_table "book_statuses", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "books", force: true do |t|
    t.string   "asin"
    t.string   "title"
    t.decimal  "price",                                               precision: 10, scale: 2
    t.integer  "rating"
    t.boolean  "flagged",                                                                      default: false
    t.boolean  "copublished"
    t.integer  "publisher_id"
    t.integer  "language_id"
    t.integer  "genre_id"
    t.text     "description"
    t.datetime "created_at",                                                                                   null: false
    t.datetime "updated_at",                                                                                   null: false
    t.date     "date_added"
    t.boolean  "restricted"
    t.integer  "limited"
    t.integer  "fiction_type_id"
    t.integer  "textbook_level_id"
    t.integer  "textbook_subject_id"
    t.integer  "book_status_id"
    t.boolean  "source_file"
    t.boolean  "source_cover"
    t.boolean  "mobi"
    t.boolean  "epub"
    t.boolean  "fixed_epub"
    t.text     "comments"
    t.string   "mou_fname"
    t.integer  "origin_id"
    t.integer  "appstatus_id"
    t.string   "appstatus"
    t.string   "keywords"
    t.integer  "read_level_id"
    t.integer  "textbook_sumlevel_id"
    t.integer  "category_id"
    t.integer  "subcategory_id"
    t.boolean  "in_store",                                                                     default: false
    t.string   "binu_source_file_name"
    t.string   "binu_paperback_equivalent"
    t.string   "binu_sort_title"
    t.string   "binu_series"
    t.string   "binu_creator_1_name"
    t.string   "binu_creator_1_role"
    t.string   "binu_publisher"
    t.string   "binu_imprint"
    t.string   "binu_pub_date"
    t.string   "binu_srp_inc_vat"
    t.string   "binu_currency"
    t.string   "binu_on_sale_date"
    t.string   "binu_langauge"
    t.string   "binu_geo_rights"
    t.string   "binu_subject1"
    t.string   "binu_subject2"
    t.string   "binu_bisac"
    t.string   "binu_bic"
    t.string   "binu_bic2"
    t.string   "binu_fiction_subject2"
    t.string   "binu_keyword"
    t.string   "binu_short_description"
    t.string   "binu_not_for_sale"
    t.string   "binu_ready_for_sale"
    t.string   "binu_country"
    t.boolean  "certified_by_national_board_of_education"
    t.integer  "book_id"
    t.boolean  "geo_restricted"
    t.string   "geo_restrictedby"
    t.string   "pricingmodel",                             limit: 4
    t.string   "textguide_book_id",                        limit: 45
    t.string   "image"
  end

  add_index "books", ["book_status_id", "appstatus_id"], name: "index_books_on_book_status_id_and_appstatus_id", using: :btree
  add_index "books", ["category_id"], name: "index_books_on_category_id", using: :btree
  add_index "books", ["fiction_type_id"], name: "index_books_on_fiction_type_id", using: :btree
  add_index "books", ["genre_id"], name: "books_genre_index", using: :btree
  add_index "books", ["language_id"], name: "books_language_index", using: :btree
  add_index "books", ["publisher_id"], name: "books_publisher_index", using: :btree
  add_index "books", ["read_level_id"], name: "index_books_on_read_level_id", using: :btree
  add_index "books", ["subcategory_id"], name: "index_books_on_subcategory_id", using: :btree
  add_index "books", ["textbook_level_id"], name: "index_books_on_textbook_level_id", using: :btree
  add_index "books", ["textbook_subject_id"], name: "index_books_on_textbook_subject_id", using: :btree
  add_index "books", ["textbook_sumlevel_id"], name: "index_books_on_textbook_sumlevel_id", using: :btree

  create_table "books_content_buckets", id: false, force: true do |t|
    t.integer "book_id"
    t.integer "content_bucket_id"
  end

  add_index "books_content_buckets", ["book_id", "content_bucket_id"], name: "index_books_content_buckets_on_book_id_and_content_bucket_id", using: :btree

  create_table "books_groups", id: false, force: true do |t|
    t.integer "book_id",  null: false
    t.integer "group_id", null: false
  end

  add_index "books_groups", ["group_id", "book_id"], name: "index_books_groups_on_group_id_and_book_id", using: :btree

  create_table "books_levels", id: false, force: true do |t|
    t.integer "book_id"
    t.integer "level_id"
  end

  add_index "books_levels", ["book_id", "level_id"], name: "index_books_levels_on_book_id_and_level_id", using: :btree

  create_table "books_platforms", id: false, force: true do |t|
    t.integer "book_id"
    t.integer "platform_id"
  end

  add_index "books_platforms", ["book_id", "platform_id"], name: "index_books_platforms_on_book_id_and_platform_id", using: :btree

  create_table "books_publishing_rights", id: false, force: true do |t|
    t.integer "book_id"
    t.integer "publishing_right_id"
  end

  add_index "books_publishing_rights", ["book_id", "publishing_right_id"], name: "book_publishing_right_index", unique: true, using: :btree

  create_table "books_recommendations", id: false, force: true do |t|
    t.integer "book_id",           null: false
    t.integer "recommendation_id", null: false
  end

  add_index "books_recommendations", ["book_id", "recommendation_id"], name: "index_books_recommendations_on_book_id_and_recommendation_id", using: :btree

  create_table "categories", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "content_buckets", force: true do |t|
    t.string   "name"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "project_id"
    t.string   "friendly_name"
  end

  create_table "content_buckets_homerooms", id: false, force: true do |t|
    t.integer "content_bucket_id"
    t.integer "homeroom_id"
  end

  add_index "content_buckets_homerooms", ["content_bucket_id", "homeroom_id"], name: "content_bucket_homeroom_index", unique: true, using: :btree

  create_table "continents", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "countries_recommendations", id: false, force: true do |t|
    t.integer "recommendation_id", null: false
    t.integer "user_country_id"
    t.integer "book_country_id"
  end

  create_table "delayed_jobs", force: true do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "device_types", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "devices", force: true do |t|
    t.string   "serial_number"
    t.boolean  "flagged",           default: false
    t.integer  "control"
    t.boolean  "reinforced_screen", default: false
    t.integer  "device_type_id"
    t.integer  "account_id"
    t.integer  "purchase_order_id"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.string   "status"
    t.string   "return_reason"
    t.text     "comments"
    t.string   "action"
  end

  add_index "devices", ["account_id", "purchase_order_id", "device_type_id"], name: "device_account_po_dt_index", using: :btree

  create_table "events", force: true do |t|
    t.string   "name"
    t.integer  "device_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "events", ["device_id"], name: "index_events_on_device_id", using: :btree

  create_table "failed_updates", force: true do |t|
    t.integer  "book_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "fiction_types", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "genres", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "geographies", force: true do |t|
    t.string   "resource_type"
    t.string   "resource_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "grades_books", id: false, force: true do |t|
    t.integer "book_id"
    t.integer "origin_grade_id"
  end

  add_index "grades_books", ["book_id", "origin_grade_id"], name: "index_grades_books_on_book_id_and_origin_grade_id", using: :btree

  create_table "groups", force: true do |t|
    t.integer "user_id"
    t.string  "name"
    t.string  "country"
    t.string  "description"
  end

  create_table "homerooms", force: true do |t|
    t.string   "name"
    t.integer  "school_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "homerooms", ["school_id"], name: "index_homerooms_on_school_id", using: :btree

  create_table "homerooms_content_buckets", id: false, force: true do |t|
    t.integer "content_bucket_id"
    t.integer "homeroom_id"
  end

  add_index "homerooms_content_buckets", ["homeroom_id", "content_bucket_id"], name: "homeroom_content_bucket_index", unique: true, using: :btree

  create_table "kdp_reports", force: true do |t|
    t.date     "start_date"
    t.date     "end_date"
    t.string   "asin"
    t.string   "month_sold"
    t.string   "transaction_type"
    t.integer  "net_units_sold_or_borrowed"
    t.decimal  "average_delivery_cost",      precision: 10, scale: 2
    t.decimal  "royalty",                    precision: 10, scale: 2
    t.string   "store"
    t.string   "currency"
    t.string   "exchange_rate"
    t.string   "usd_net"
    t.string   "owed_to_publisher"
    t.integer  "book_id"
    t.datetime "created_at",                                          null: false
    t.datetime "updated_at",                                          null: false
  end

  create_table "kdp_reports_bck", id: false, force: true do |t|
    t.integer  "id",                                                  default: 0, null: false
    t.date     "start_date"
    t.date     "end_date"
    t.string   "asin"
    t.string   "month_sold"
    t.string   "transaction_type"
    t.integer  "net_units_sold_or_borrowed"
    t.decimal  "average_delivery_cost",      precision: 10, scale: 2
    t.decimal  "royalty",                    precision: 10, scale: 2
    t.string   "store"
    t.string   "currency"
    t.string   "exchange_rate"
    t.string   "usd_net"
    t.string   "owed_to_publisher"
    t.integer  "book_id"
    t.datetime "created_at",                                                      null: false
    t.datetime "updated_at",                                                      null: false
  end

  create_table "languages", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "languages_recommendations", id: false, force: true do |t|
    t.integer "recommendation_id", null: false
    t.integer "user_language_id"
    t.integer "book_language_id"
  end

  create_table "levels", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "models", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "order_items", force: true do |t|
    t.integer  "order_id"
    t.integer  "book_id"
    t.integer  "content_bucket_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  add_index "order_items", ["order_id", "book_id"], name: "index_order_items_on_order_id_and_book_id", using: :btree

  create_table "orders", force: true do |t|
    t.boolean  "confirmed",     default: false
    t.integer  "admin_user_id"
    t.integer  "project_id"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  create_table "origins", force: true do |t|
    t.string   "name"
    t.integer  "continent_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "origins", ["continent_id"], name: "index_origins_on_continent_id", using: :btree

  create_table "platforms", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_types", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "projects", force: true do |t|
    t.string   "name"
    t.integer  "model_id"
    t.integer  "origin_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "target_size"
    t.integer  "current_size"
    t.text     "comments"
    t.integer  "admin_user_id"
    t.integer  "project_type_id"
  end

  add_index "projects", ["origin_id", "model_id"], name: "index_projects_on_origin_id_and_model_id", using: :btree

  create_table "pub_contacts", force: true do |t|
    t.string   "name"
    t.string   "email",        limit: 35
    t.string   "telephone",    limit: 25
    t.text     "comments"
    t.integer  "publisher_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "publishers", force: true do |t|
    t.string   "name"
    t.integer  "origin_id"
    t.datetime "created_at",                                            null: false
    t.datetime "updated_at",                                            null: false
    t.string   "address"
    t.string   "telephone"
    t.string   "email"
    t.string   "account_name"
    t.string   "account_number"
    t.string   "bank"
    t.string   "branch"
    t.string   "swift_code"
    t.string   "branch_code"
    t.string   "bank_code"
    t.string   "name_US_corresponding_bank"
    t.string   "routing_number"
    t.date     "contract_end_date"
    t.string   "free",                       limit: 5, default: "free"
    t.date     "platform_mob_contractdate"
    t.boolean  "self_published"
    t.string   "imprints"
    t.string   "city"
    t.string   "postal_code"
    t.integer  "country_id"
    t.string   "alernate_add1"
    t.string   "alernate_add2"
    t.string   "website"
    t.string   "shared_ftp_link"
    t.integer  "platform_mobile"
    t.integer  "platform_ereader"
  end

  add_index "publishers", ["origin_id"], name: "index_publishers_on_origin_id", using: :btree

  create_table "publishing_rights", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "purchase_orders", force: true do |t|
    t.string   "po_number"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.date     "date_ordered"
    t.date     "warranty_end_date"
    t.integer  "project_id"
    t.text     "comments"
  end

  create_table "purchases", force: true do |t|
    t.integer  "user_id",      null: false
    t.integer  "book_id",      null: false
    t.date     "purchased_on"
    t.boolean  "is_purchased"
    t.boolean  "is_approved"
    t.datetime "approved_on"
    t.boolean  "flagged"
  end

  create_table "pushes", force: true do |t|
    t.integer  "book_id"
    t.integer  "content_bucket_id"
    t.date     "push_date"
    t.boolean  "successful"
    t.text     "comments"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  add_index "pushes", ["book_id", "content_bucket_id"], name: "index_pushes_on_book_id_and_content_bucket_id", using: :btree

  create_table "read_levels", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "recommendations", force: true do |t|
    t.string   "organization"
    t.string   "school"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "recommendation_type"
  end

  create_table "restrictedcontinent_books", id: false, force: true do |t|
    t.integer "book_id"
    t.integer "geo_continent_id"
  end

  add_index "restrictedcontinent_books", ["book_id", "geo_continent_id"], name: "index_restrictedcontinent_books_on_book_id_and_geo_continent_id", using: :btree

  create_table "restrictedorigin_books", id: false, force: true do |t|
    t.integer "book_id"
    t.integer "geo_origin_id"
  end

  add_index "restrictedorigin_books", ["book_id", "geo_origin_id"], name: "index_restrictedorigin_books_on_book_id_and_geo_origin_id", using: :btree

  create_table "schools", force: true do |t|
    t.string   "name"
    t.integer  "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "schools", ["project_id"], name: "index_schools_on_project_id", using: :btree

  create_table "students", force: true do |t|
    t.string   "first_name"
    t.string   "other_names"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "account_id"
    t.text     "comments"
    t.string   "role"
  end

  add_index "students", ["account_id"], name: "index_students_on_account_id", unique: true, using: :btree

  create_table "subcategories", force: true do |t|
    t.string   "name"
    t.integer  "category_id"
    t.integer  "book_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "textbook_levels", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "origin_id"
  end

  create_table "textbook_subjects", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "textbook_sumlevels", force: true do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
