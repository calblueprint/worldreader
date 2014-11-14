class Admin::RecommendationsController < ApplicationController
  def index
    @recommendations = Recommendation.all
  end

  def new
    @books = Book.all
    @users = User.all
  end

  def update
    recommendation = Recommendation.find(params[:id])
    recommendation.books << Book.new
    recommendation.save
  end
end
