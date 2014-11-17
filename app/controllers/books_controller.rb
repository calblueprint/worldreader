class BooksController < ApplicationController
  before_filter :search_tags

  def index
    @books = Book.all
    gon.current_user = current_user
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
        value: index, text: x, tagType: "Location"
      }
    }
    level_tags = Level.uniq.pluck(:name).map{ |x|
      index += 1
      {
        value: index, text: x, tagType: "Level"
      }
    }
    language_tags = Language.uniq.pluck(:name).map{ |x|
      index += 1
      {
        value: index, text: x, tagType: "Language"
      }
    }
    genre_tags = Genre.uniq.pluck(:name).map{ |x|
      index += 1
      {
        value: index, text: x, tagType: "Genre"
      }
    }
    gon.all_tags = country_tags + level_tags + language_tags + genre_tags
    
  end
end
