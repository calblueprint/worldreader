class RegistrationsController < Devise::RegistrationsController
  before_filter :configure_permitted_parameters, only: [:create]
  skip_before_filter :require_no_authentication

  def create
    build_resource(sign_up_params)
    puts "SIGN UP PARAMS ======= "
    puts sign_up_params
    project = Project.new(project_params)
    resource.projects << project
    book_lists = []
    if booklist_params[:book_list_ids]
      book_lists = BookList.find(booklist_params[:book_list_ids])
    end
    books = book_lists.map(&:books).flatten.to_set.to_a
    booklist = BookList.new(name: booklist_params[:name], books: books)
    resource.book_lists << booklist
    if project.valid? && booklist.valid? && resource.valid?
      project.save
      booklist.save
      resource.save
      UserNotifier.send_signup_email(sign_up_params)
      render json: { message: "User created!", user: resource }
    else
      clean_up_passwords resource
      errors = resource.errors.full_messages +
               project.errors.full_messages +
               booklist.errors.full_messages
      render json: { message: "User could not be created!", errors: errors }, status: :forbidden
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) do |u|
      u.permit(:email, :password, :password_confirmation)
    end
  end

  private

  def booklist_params
    params.require(:booklist).permit(:name, book_list_ids: [])
  end

  def project_params
    params.require(:project).permit(:name, :origin_id, language_ids: [])
  end
end
