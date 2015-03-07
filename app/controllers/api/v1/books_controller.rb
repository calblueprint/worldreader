class Api::V1::BooksController < ApplicationController

  def index
    page = params[:page] || 1
    books = Book.all.paginate page: page, per_page: 10
    render json: books
  end

  def search
    term = params[:term]
    tags = ActiveSupport::JSON.decode params[:tags]
    tags_level_adjusted = []
    levels_set = Set.new []
    tags.each do |tag|
      if tag["tagType"] == "levels"
        levels_set.merge(Book.LEVELS_CONVERT[tag["text"]])
      else
        tags_levels_adjusted.push(tag)
      end
    end
    tags_level_adjusted.concat(levels_set.to_a())
    results = []
    page = params[:page].to_i || 1
    books = Book.query(term, tags, page)
    books.each_with_index do |x, i|
      results.push(x.as_json)
    end
    render json: {books: results}
  end

  def page
    page = params[:page] || 1
    @books = Book.paginate page: page, per_page: 5
    render json: @books
  end
end
