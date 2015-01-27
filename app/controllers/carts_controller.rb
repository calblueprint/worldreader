class CartsController < ApplicationController

  def show
    @cart_items = current_user.cart
    @donated_books = @cart_items.select { |book| book.donated? }
    @paid_books = @cart_items.select { |book| !book.donated? }
  end

  def create_purchase
    books = Book.find(params[:book_ids])
    current_user.cart_purchases.each do |purchase|
      purchase.is_purchased = true
      purchase.purchased_on = Date.today
      purchase.save
    end
    flash.now[:success] = "Your purchase is being processed!"
    flash.keep(:success)
    render js: "window.location = '#{root_path}'"
  end

  def delete
  end
end
