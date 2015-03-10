class BooksController < ApplicationController
  load_and_authorize_resource
  before_filter :search_tags

  def index
    @books = []
    gon.current_user = current_user
    gon.books = @books
  end

  def show
    @book = Book.find(params[:id])
  end

  private

  def search_tags
    index = 0
    country_tags = Country.uniq.pluck(:name).map{ |x|
      index += 1
      {
        value: index, text: x, tagType: "country"
      }
    }
    level_tags = Level.uniq.pluck(:name).map{ |x|
      index += 1
      {
        value: index, text: x, tagType: "levels"
      }
    }
    language_tags = Language.uniq.pluck(:name).map{ |x|
      index += 1
      {
        value: index, text: x, tagType: "language"
      }
    }
    genre_tags = Genre.uniq.pluck(:name).map{ |x|
      index += 1
      {
        value: index, text: x, tagType: "genre"
      }
    }
    subcategory_tags = Subcategory.uniq.pluck(:name).map { |x|
      index += 1
      {
        value: index, text: x, tagType: "subcategory"
      }
    }
    gon.all_tags = country_tags + level_tags + language_tags + genre_tags +
        subcategory_tags
  end
end
