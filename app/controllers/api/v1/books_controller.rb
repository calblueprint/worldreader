class Api::V1::BooksController < ApplicationController

  def search
    term = params[:term]
    tags = ActiveSupport::JSON.decode params[:tags]
    results = []
    page = params[:page] || 1
    books = Book.query(term, tags)
    books.each_with_index do |x, i|
      results.push(x.as_json)
    end
    books = results.paginate(page: page, per_page: 5)
    render json: {books: results,
                  last_page: books.current_page >= books.total_pages}
  end

  def page
    page = params[:page] || 1
    @books = Book.paginate page: page, per_page: 5
    render json: @books
  end
end
