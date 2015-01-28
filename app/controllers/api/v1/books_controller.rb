class Api::V1::BooksController < ApplicationController

  def search
    term = params[:term]
    tags = ActiveSupport::JSON.decode params[:tags]
    results = []
    page = params[:page] || 1
    books = Book.query(term, tags).paginate page: page, per_page: 5
    books.each_with_index do |x, i|
      results.push(x.as_json)
    end
    render json: results
  end

  def page
    page = params[:page] || 1
    @books = Book.paginate page: page, per_page: 5
    render json: @books
  end
end
