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

  def add
    book = Book.find(params[:book_id])
    errors = []
    params[:booklist_ids].each do |id|
      booklist = BookList.find(id)
      if booklist.books.include?(book)
        errors << book.title + " is already in " + booklist.name
      else
        booklist.books << book
      end
    end
    if errors.empty?
      render json: { message: "Book successfully added" }, status: :ok
    else
      render json: { errors: errors }, status: :error
    end
  end

  def update
    booklist = BookList.find(params[:id])
    if booklist.update book_list_params
      render json: { booklist: booklist }, status: :ok
    else
      render json: { message: "Failed to edit booklist" }, status: :error
    end
  end

  def books
    book_data = []
    BookList.find(params[:id]).book_list_entries.each do |entry|
      flag_info = { flagged_user_email: entry.flagged_user.try(:email),
                    flagged_user_role: entry.flagged_user.try(:role) }
      book_data << entry.book.as_json.merge(flag_info)
    end
    render json: book_data
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
      render json: { message: "Book successfully removed" }
    else
      render json: { message: "Failed to remove book!" }
    end
  end

  def toggle_flag
    list = BookList.find(params[:id])
    flagged_user = User.find(params[:user_id]) if params[:flagged] == "true"
    book_list_entry = list.book_list_entries.where(book_id: params[:book_id]).first
    book_list_entry.flagged_user = flagged_user
    if book_list_entry.save
      render json: { email: flagged_user.try(:email),
                     role: flagged_user.try(:role) }, status: :ok
    else
      render json: { message: "Error toggling flag" }, status: :error
    end
  end

  private

  def book_list_params
    params.require(:base_list).permit(:name, :published, book_ids: [])
  end
end
