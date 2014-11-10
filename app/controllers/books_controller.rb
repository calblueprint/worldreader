class BooksController < ApplicationController
  def index
    gon.books = Book.all
    gon.current_user = current_user
    if user_signed_in?
      gon.cart = current_user.cart
    else
      gon.cart = []
    end
  end

  def show
    @book = Book.find(params[:id])
  end
end
