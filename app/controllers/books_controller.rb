class BooksController < ApplicationController
  def index
    @books = Book.all
    @current_user = current_user
  end

  def show
    @book = Book.find(params[:id])
  end
end
