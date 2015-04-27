class Admin::DashboardController < ApplicationController
  before_filter :verify_admin

  def index
  end

  def display_all_partners
    render json: User.partners
  end

  def partner_information
    user = User.find(params[:id])
    render json: user
  end

  def display_groups
    groups = User.find(params[:id]).projects.flat_map(&:content_buckets)
    render json: groups
  end

  def display_books
    books = ContentBucket.find(params[:id]).books
    render json: books
  end

  def display_book
    book = Book.find(params[:id])
    render json: book
  end

  def generate_failed_report
    failed_books = FailedUpdate.all.map(&:book)
    send_data Book.to_csv(failed_books),
              type:         "text/csv; charset=iso-8859-1; header=present",
              disposition:  "attachment;failed_update.csv"
  end

  private

  def verify_admin
    redirect_to root_url unless
      current_user.try(:admin?) || current_user.try(:vip?)
  end
end
