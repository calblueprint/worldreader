class BooksController < ApplicationController
  before_filter: search_tags

  def index
    @books = Book.all
    gon.current_user = current_user
  end

  def show
    @book = Book.find(params[:id])
  end

  private

  def search_tags
    gon.country_tags = Book.uniq.pluck(:country)
    gon.age_tags = Book.uniq.pluck(:age)
    gon.language_tags = Book.uniq.pluck(:language)
    gon.genre_tags = Book.uniq.pluck(:genre)
end
