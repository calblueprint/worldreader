class BooksController < ApplicationController
  load_and_authorize_resource

  def index
    @books = []
    if user_signed_in?
      id = params[:booklist]
      booklist = current_user.user? ? current_user.book_lists : BookList.all
      @booklist = booklist.map(&:id).include?(id) ? id : booklist.first.id
      gon.booklists = booklist.map{ |x|
        {
          id: x.id, name: x.name
        }
      }
    end
    gon.current_user = current_user
    gon.books = @books
  end

  def show
    @book = Book.find(params[:id])
  end
end
