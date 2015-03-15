class BooksController < ApplicationController
  load_and_authorize_resource

  def index
    @books = []
    gon.current_user = current_user
    gon.books = @books
  end

  def show
    @book = Book.find(params[:id])
  end

end
