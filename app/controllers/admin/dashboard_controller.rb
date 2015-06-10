class Admin::DashboardController < ApplicationController
  before_filter :verify_admin
  before_action :new_partner_info

  def index
  end

  def partners
    if params[:query].to_s != ""
      render json: User.query(params[:query])
    else
      render json: User.partners
    end
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
    unless current_user.try(:admin?) || current_user.try(:vip?)
      redirect_to root_url, alert: "Access denied."
    end
  end

  def new_partner_info
    @countries = Country.tags
    @languages = Language.tags
    @booklists = BookList.tags
  end
end
