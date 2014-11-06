class BooksController < ApplicationController
  def index
    gon.books = Book.all
  end

  def show
    @book = Book.find(params[:id])
  end
end
