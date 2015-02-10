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

ActiveRecord::Schema.define(version: 20150204011311) do

  create_table "authors", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "authors_books", force: true do |t|
    t.integer  "book_id"
    t.integer  "author_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "books", force: true do |t|
    t.string   "name"
    t.string   "isbn"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
    t.string   "asin"
    t.integer  "language_id"
    t.integer  "genre_id"
    t.integer  "country_id"
    t.decimal  "price"
    t.integer  "publisher_id"
  end

  create_table "books_countries", force: true do |t|
    t.integer  "country_id"
    t.integer  "book_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "books_groups", id: false, force: true do |t|
    t.integer "group_id", null: false
    t.integer "book_id",  null: false
  end

  add_index "books_groups", ["group_id", "book_id"], name: "index_books_groups_on_group_id_and_book_id"

  create_table "books_levels", force: true do |t|
    t.integer  "book_id"
    t.integer  "level_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "books_recommendations", id: false, force: true do |t|
    t.integer "book_id",           null: false
    t.integer "recommendation_id", null: false
  end

  add_index "books_recommendations", ["book_id", "recommendation_id"], name: "index_books_recommendations_on_book_id_and_recommendation_id"

  create_table "countries", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
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

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority"

  create_table "genres", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups", force: true do |t|
    t.integer  "user_id"
    t.string   "name"
    t.string   "country"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "languages", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "languages_recommendations", id: false, force: true do |t|
    t.integer "recommendation_id", null: false
    t.integer "user_language_id"
    t.integer "book_language_id"
  end

  create_table "levels", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "publishers", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "purchases", force: true do |t|
    t.integer "user_id",      null: false
    t.integer "book_id",      null: false
    t.date    "purchased_on"
    t.boolean "is_purchased"
    t.boolean "is_approved"
  end

  create_table "recommendations", force: true do |t|
    t.string   "organization"
    t.string   "school"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "recommendation_type"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "role"
    t.string   "first_name"
    t.string   "last_name"
    t.integer  "country_id"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
