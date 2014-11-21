class Api::V1::BooksController < ApplicationController

  def search
    term = params[:term]
    tags = ActiveSupport::JSON.decode params[:tags]
    results = []
    Book.query(term, tags).each_with_index do |x, i|
      results.push(x.as_json)
    end
    render json: results
  end
end
