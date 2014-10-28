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

ActiveRecord::Schema.define(version: 20141023202610) do

  create_table "books", force: true do |t|
    t.string   "name"
    t.string   "isbn"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
    t.string   "asin"
  end

  create_table "books_groups", id: false, force: true do |t|
    t.integer "group_id", null: false
    t.integer "book_id",  null: false
  end

  add_index "books_groups", ["group_id", "book_id"], name: "index_books_groups_on_group_id_and_book_id"

  create_table "groups", force: true do |t|
    t.integer  "user_id"
    t.string   "name"
    t.string   "country"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "purchases", force: true do |t|
    t.integer "user_id",      null: false
    t.integer "book_id",      null: false
    t.date    "purchased_on"
    t.boolean "is_purchased"
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
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
