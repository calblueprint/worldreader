class Admin::RecommendationsController < ApplicationController
  def index
    @recommendations = Recommendation.all
  end

  def add_recommendation
    recommendation = Recommendation.create()
    recommendation_type = params[:recommendation_type].to_i
    recommendation.recommendation_type = recommendation_type

    if recommendation_type == 0
      book_tags = ActiveSupport::JSON.decode params[:book_tags]
      book_tags.each do |book_tag|
        if book_tag["tagType"].eql? "countries"
          recommendation.book_countries << Country.find(book_tag["id"])
        elsif book_tag["tagType"].eql? "language"
          recommendation.book_languages << Language.find(book_tag["id"])
        end
      end
    else
      recommendation.books << Book.find(params[:book_ids])
    end
    project_tags = ActiveSupport::JSON.decode params[:project_tags]
    project_tags.each do |proj_tag|
      if proj_tag["tagType"].eql? "countries"
        recommendation.proj_countries << Country.find(proj_tag["id"])
      elsif proj_tag["tagType"].eql? "language"
        recommendation.proj_languages << Language.find(proj_tag["id"])
      end
    end

    recommendation.save
    render :nothing => true
  end

  def edit_recommendation
    recommendation = Recommendation.find(params[:recommendation_id])

    book_ids = params[:book_ids]
    school = params[:school]
    organization = params[:organization]
    country = params[:country]

    recommendation.books = []
    book_ids.each do |book_id|
      recommendation.books << Book.find(book_id)
    end
    recommendation.school = school
    recommendation.organization = organization
    recommendation.country = country

    recommendation.save
    render nothing: true
  end

  def delete_recommendation
    Recommendation.find(params[:recommendation_id]).destroy
    render nothing: true
  end

  def display_recommendations
    recommendations = Recommendation.all
    render json: recommendations
  end

    def display_books
    recommendation = Recommendation.find(params[:id])
    books = recommendation.books
    render json: books
  end

  def display_book_tags
    recommendation = Recommendation.find(params[:id])
    countries = recommendation.book_countries
    languages = recommendation.book_languages
    render json: {countries: countries, languages: languages}
  end

  def display_proj_tags
    recommendation = Recommendation.find(params[:id])
    countries = recommendation.proj_countries
    languages = recommendation.proj_languages
    render json: {countries: countries, languages: languages}
  end
end
