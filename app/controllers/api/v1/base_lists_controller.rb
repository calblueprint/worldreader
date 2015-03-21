class Api::V1::BaseListsController < ApplicationController
  def index
    render json: BookList.all
  end

  def create
    book_list = BookList.create base_list_params
    if book_list
      render json: { message: "Baselist created." }, status: :ok
    else
      render json: { message: "Error" }, status: :error
    end
  end

  private

  def base_list_params
    params.require(:base_list).permit(:name, :published, :book_list_ids)
  end
end
