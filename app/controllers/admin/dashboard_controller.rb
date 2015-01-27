class Admin::DashboardController < ApplicationController
  before_filter :verify_admin

  def index
  end

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
    is_approved = params[:is_approved] == "true"
    purchases = Purchase.where(user_id: params[:id], is_approved: is_approved, is_purchased: true)
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
    render :nothing => true
  end

  def disapprove_purchases
    params[:purchases].each do |purchase_id|
        Purchase.find(purchase_id).update(is_approved: false)
    end
    render :nothing => true
  end

  def get_number_purchases
    render text: User.find(params[:id]).purchases.where(is_approved: nil, is_purchased: true).count
  end

  private

  def verify_admin
    redirect_to root_url unless current_user.try(:admin?)
  end
end
