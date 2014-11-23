class CartsController < ApplicationController
  def show
    @cart_items = current_user.cart
    @donated_books = @cart_items.select { |book| book.donated? }
    @paid_books = @cart_items.select { |book| !book.donated? }
  end

  def add
    book = Book.find(params[:book_id])
    Purchase.create(book_id: book.id, user_id: current_user.id, is_purchased: false)
    redirect_to cart_path(current_user.id)
  end

  def delete
  end
end
