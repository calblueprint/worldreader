class Api::V1::BooksController < ApplicationController
  def index
    page = params[:page] || 1
    books = Book.all.paginate page: page, per_page: Constants::PAGE_SIZE
    render json: books
  end

  def search
    term = params[:term]
    tags = ActiveSupport::JSON.decode params[:tags]
    results = []
    page = params[:page].to_i || 1
    books = Book.query(term, tags, page)
    books.each do |x|
      results.push(x.as_json)
    end
    render json: { books: results }
  end

  def page
    page = params[:page] || 1
    @books = Book.paginate page: page, per_page: Constants::PAGE_SIZE
    render json: @books
  end
end
