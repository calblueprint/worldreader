class BooksController < ApplicationController
  def index
    gon.books = Book.all
    gon.current_user = current_user
  end

  def show
    @book = Book.find(params[:id])
  end
end
