class Api::V1::ProjectsController < ApplicationController

  def search
    term = params[:term]
    tags = ActiveSupport::JSON.decode params[:tags]
    results = []
    projects = Project.query(term, tags)
    projects.each_with_index do |x, i|
      results.push(x.as_json)
    end
    render json: {projects: results}
  end
end
