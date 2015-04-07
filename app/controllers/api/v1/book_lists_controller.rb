class Api::V1::BookListsController < ApplicationController
  def index
    render json: BookList.all
  end

  def create
    book_list = BookList.create book_list_params
    if book_list
      render json: { message: "List created." }, status: :ok
    else
      render json: { message: "Error" }, status: :error
    end
  end

  def books
    render json: BookList.find(params[:id]).books
  end

  def csv
    send_data Book.to_csv(BookList.find(params[:id]).books),
      :type => 'text/csv; charset=iso-8859-1; header=present',
      :disposition => "attachment;books.csv"
  end

  def remove
    booklist = BookList.find(params[:id])
    book = Book.find(params[:book_id])
    if booklist.books.delete book
      render json: booklist.books
    else
      render json: { message: "Failed to remove book!" }
    end
  end

  private

  def book_list_params
    params.require(:base_list).permit(:name, :published, book_ids: [])
  end
end
