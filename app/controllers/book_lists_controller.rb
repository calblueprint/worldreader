class BookListsController < ApplicationController
  load_and_authorize_resource

  def index
    @booklists = BookList.published
  end
end
