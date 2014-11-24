class CartsController < ApplicationController
  def show
    @cart_items = current_user.cart
    @donated_books = @cart_items.select { |book| book.donated? }
    @paid_books = @cart_items.select { |book| !book.donated? }
  end

  def create_purchase
    puts params[:books_ids]
    books = Book.find(params[:book_ids])
    purchases = books.each do |book|
      Purchase.create book_id: book.id, user_id: current_user.id, is_purchased: true
    end
    flash.now[:success] = "Your purchase is being processed!"
    flash.keep(:success)
    render js: "window.location = '#{root_path}'"
  end

  def delete
  end
end
