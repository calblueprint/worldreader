class CartsController < ApplicationController

  def show
    puts "UPDATING SHOOOOOOOOW"
    @donated_books = current_user.cart.select { |item| item[:book].donated? }
    @paid_books = current_user.cart.select { |item| !item[:book].donated? }
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
