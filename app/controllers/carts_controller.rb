class CartsController < ApplicationController

  def show
    @donated_books, @paid_books = [], []
    current_user.cart.each_with_index do |book, index|
      data = book.as_json.merge(groups: current_user.cart_groups[index])
      @donated_books << data if book.donated?
      @paid_books << data if !book.donated?
    end
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
