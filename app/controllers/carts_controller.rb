class CartsController < ApplicationController
  def show
    @cart_items = current_user.purchases.is_purchased(false)
  end

  def add
    book = Book.find(params[:book_id])
    Purchase.create(book_id: book.id, user_id: current_user.id, is_purchased: false)
    redirect_to cart_path(current_user.id)
  end

  def delete
  end
end
