class BooksController < ApplicationController
  before_filter :search_tags

  def index
    @books = Book.all
    gon.current_user = current_user
  end

  def show
    @book = Book.find(params[:id])
  end

  private

  def search_tags
    gon.country_tags = Country.uniq.pluck(:name)
    gon.level_tags = Level.uniq.pluck(:name)
    gon.language_tags = Language.uniq.pluck(:name)
    gon.genre_tags = Genre.uniq.pluck(:name)
  end
end
