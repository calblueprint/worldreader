class Api::V1::BooksController < ApplicationController

  def search
    term = params[:term]
    tags = ActiveSupport::JSON.decode params[:tags]
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
