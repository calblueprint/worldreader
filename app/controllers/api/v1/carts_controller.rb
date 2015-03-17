class Api::V1::CartsController < ApplicationController

  def add
    book = Book.find(params[:book_id])
    groups = params[:groups]
    if groups.blank?
      errors = ["Must select at least one group"]
      render json: { errors: errors }, status: :bad_request
    else
      p = Purchase.create(book_id: book.id, user_id: current_user.id, is_purchased: false)
      groups.each do |group|
        p.content_buckets << ContentBucket.find(group)
      end
      render json: {message: "Added!"}
    end
  end

  def remove
    # TODO Move this into a API BaseController for user auth
    user = User.find(params[:user_id])
    book = Book.find(params[:book_id])
    p = Purchase.where(book_id: book.id, user_id: user.id, is_purchased: false)
    p.destroy_all
    render json: {message: "Removed!"}
  end
end
