class Admin::DashboardController < ApplicationController

  def index
  end

  def search
  end
  
  # ordered so that partners with new purchases are first
  def display_all_partners 
    partners = User.partners_no_new_purchases
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
    purchases = Purchase.where(user_id: params[:id], is_approved: false, is_purchased: true)
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

  def generate_csv
    send_data Purchase.to_csv(Purchase.find(params[:purchases])), 
      :type => 'text/csv; charset=iso-8859-1; header=present',
      :disposition => "attachment;purchases.csv"
  end

  def convert_purchases
    params[:purchases].each do |purchase_id|
        Purchase.find(purchase_id).update(is_approved: true)
    end
  end

  def get_number_purchases
    render text: User.find(params[:id]).purchases.where(is_approved: false, is_purchased: true).count
  end
end
