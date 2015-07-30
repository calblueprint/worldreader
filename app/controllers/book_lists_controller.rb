class BookListsController < ApplicationController
  load_and_authorize_resource

  def index
    @booklists = BookList.published
  end

  def show
    booklist = BookList.find(params[:id])
    booklist.users
    redirect_to(user_booklists_path(user_id: booklist.users.first.id))
  end
end
