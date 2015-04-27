class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :admin_only, except: [:show, :booklists]

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:user_id])
    if current_user.user? &&
       @user != current_user
      redirect_to :back, alert: "Access denied."
    end
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(secure_params)
      redirect_to users_path, notice: "User updated."
    else
      redirect_to users_path, alert: "Unable to update user."
    end
  end

  def destroy
    user = User.find(params[:id])
    user.destroy
    redirect_to users_path, notice: "User deleted."
  end

  def booklists
    user = User.find(params[:user_id])
    @booklists = user.book_lists
  end

  private

  def admin_only
    unless current_user.admin?
      redirect_to :back, alert: "Access denied."
    end
  end

  def secure_params
    params.require(:user).permit(:role)
  end

end
