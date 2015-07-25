class Api::V1::BooksController < ApplicationController
  def index
    page = params[:page] || 1
    books = Book.all.paginate page: page, per_page: Constants::PAGE_SIZE
    render json: books
  end

  def csv
    books = Book.find(params[:books])
    puts Book.to_csv(books)
    send_data Book.to_csv(books),
                type:         "text/csv; charset=iso-8859-1; header=present",
                disposition:  "attachment;books.csv"
  end

  def search
    term = params[:term]
    tags = ActiveSupport::JSON.decode params[:tags]
    results = []
    page = params[:page].to_i || 1
    puts params
    books, count = Book.query(term: term,
                              tags: tags,
                              page: page,
                              sort: params[:sort])
    books.each do |x|
      results.push(x.as_json)
    end
    render json: { books: results, count: count }
  end

  def page
    page = params[:page] || 1
    @books = Book.paginate page: page, per_page: Constants::PAGE_SIZE
    render json: @books
  end
end
