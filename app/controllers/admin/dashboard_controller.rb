class Admin::DashboardController < ApplicationController

  def index
  end

  def search
  end
  
  # ordered so that partners with new purchases are first
  def display_all_partners 
    partners = User.partners
    render json: partners
  end

  def display_partners_new_purchases
    partners_new_purchases = User.partners_new_purchases
    render json: partners_new_purchases
  end

  def partner_information
    user = User.find(params[:id])
    render json: user
  end

  def display_groups
    groups = Group.where(user_id: params[:id])
    render json: groups
  end

  def display_purchases
    purchases = Purchase.where(user_id: params[:id], is_purchased: false)
    render json: purchases
  end

  def display_books
    books = Group.find(params[:id]).books
    render json: books
  end

  def display_book
    book = Book.find(params[:id])
    render json: book
  end
end
