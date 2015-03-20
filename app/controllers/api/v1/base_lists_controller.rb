class Api::V1::BaseListsController < ApplicationController
  def index
    render json: BookList.all
  end
end
