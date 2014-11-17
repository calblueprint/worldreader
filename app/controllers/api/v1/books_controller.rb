class Api::V1::BooksController < ApplicationController

  def search
    string = params[:term]
    tags = params[:tags]
    results = Book.query(string, tags)
    render json: results

end
