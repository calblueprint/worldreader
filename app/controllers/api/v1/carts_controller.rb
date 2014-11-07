class Api::V1::CartsController < ApplicationController

  def add
    book = Book.find(params[:book_id])
    p = Purchase.create(book_id: book.id, user_id: current_user.id, is_purchased: false)
    render json: {message: "Added!"}
  end

  def remove
    # TODO Move this into a API BaseController for user auth
    user = User.find(params[:user_id])
    book = Book.find(params[:book_id])
    p = Purchase.where(book_id: book.id, user_id: user.id, is_purchased: false)
    p.destroy_all
    render json: {message: "Removed!"}
  end

end
